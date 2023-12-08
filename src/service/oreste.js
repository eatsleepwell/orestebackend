import { prismaClient } from "../application/database.js";
import ResponseError from "../error/response-error.js";

export default class Oreste {

    async calculateOreste(user) {
        const data = await this.getData(user)
        const bessonRank = await this.bessonRank(data)
        const distanceScore = await this.distanceScore(bessonRank)
        const accumulation = await this.accumulateDistanceScore(distanceScore)
        const rank = await this.ranking(accumulation)

        try {
            data.map(async (item) => {
                const alternative_scores = item.alternative_scores
                alternative_scores.map(async (item) => {
                    await prismaClient.alternativeScores.updateMany({
                        where: {
                            id: item.id
                        },
                        data: {
                            besson_rank: item["besson_rank"],
                            distance_score: item["distance_score"]
                        }
                    })
                })
            })
        } catch(e) {
            throw new ResponseError(400, "Tidak dapat terhubung ke database")
        }

        try {
            data.map(async (item) => {
                await prismaClient.alternative.updateMany({
                    where: {
                        id: item.id
                    },
                    data: {
                        accumulation_score: item.accumulation,
                        rank: item.rank
                    }
                })
            })
        } catch(e) {
            throw new ResponseError(400, "Tidak dapat terhubung ke database")
        }

        return rank
    }

    async bessonRank(data) {
        const alternatives = data;

        // Membuat objek untuk menyimpan total score tiap alternative
        const alternativeScores = {};

        // Membuat objek untuk menyimpan informasi per kriteria
        const criteriaData = {};

        // Membuat objek untuk menyimpan informasi default score ranking
        const criteriaRankData = {};

        // Loop pertama untuk menghitung total score tiap alternative dan menerapkan perangkingan untuk setiap kriteria
        for (const entry of alternatives) {
            const alternativeName = entry.alternative_name;
            const scores = entry.alternative_scores;

            for (const scoreEntry of scores) {
                const criteriaCode = scoreEntry.criteria_code;
                const score = scoreEntry.score;

                // Menghitung total score tiap alternative
                alternativeScores[alternativeName] = (alternativeScores[alternativeName] || 0) + score;

                // Menerapkan perangkingan untuk kriteria tertentu
                if (!criteriaData[criteriaCode]) {
                    criteriaData[criteriaCode] = { scores: [] };
                }
                const criteriaScores = criteriaData[criteriaCode].scores;
                criteriaScores.push({ alternativeName, score });
            }
        }

        // Loop untuk mendapatkan default rank untuk setiap score
        for (const criteriaCode of Object.keys(criteriaData)) {

            const criteriaScores = await prismaClient.criteria.findFirst({
                where: {
                    criteria_code: criteriaCode
                },
                include: {
                    SubCriteria: {
                        select: {
                            sub_criteria_score: true
                        }
                    }
                }
            })
            criteriaRankData[criteriaCode] = criteriaScores.SubCriteria
        }

        for (const criteriaCode of Object.keys(criteriaRankData)) {
            // Mengambil array data sub-kriteria untuk kriteria tertentu
            const subCriteriaData = criteriaRankData[criteriaCode];

            // Urutkan data dari yang terbesar ke yang terkecil berdasarkan sub_criteria_score
            subCriteriaData.sort((a, b) => b.sub_criteria_score - a.sub_criteria_score);

            // Tambahkan key dan value baru "rank" untuk menyimpan rank pada setiap sub-kriteria
            for (let i = 0; i < subCriteriaData.length; i++) {
                subCriteriaData[i].rank = i + 1;
            }
        }

        for (const criteriaCode of Object.keys(criteriaData)) {
            const { scores } = criteriaData[criteriaCode];
            const dataRank = criteriaRankData[criteriaCode];

            const scoreCounts = {};
            scores.forEach((scoreEntry) => {
                const score = scoreEntry.score;
                scoreCounts[score] = (scoreCounts[score] || 0) + 1;
            });

            for (const scoreEntry of scores) {
                const matchingRank = dataRank.find((rankItem) => rankItem.sub_criteria_score === scoreEntry.score);

                if (matchingRank && scoreCounts[scoreEntry.score] === 1) {
                    scoreEntry.rank = matchingRank.rank;
                } else {
                    scoreEntry.rank = 0;
                }
            }
        }

        // Loop untuk menerapkan perangkingan pada setiap kriteria
        for (const criteriaCode of Object.keys(criteriaData)) {
            const { scores } = criteriaData[criteriaCode];
            scores.sort((a, b) => b.score - a.score);
            let rank = 1;
            let totalRank = 0;
            let count = 0;
            for (const scoreEntry of scores) {
                if (scoreEntry.rank === 0) {
                    scoreEntry.rank = rank;
                    totalRank += rank;
                    count++;
                    rank++;
                }
            }
        }
        // Loop untuk menambahkan hasil rata-rata dan nilai rank ke setiap alternative_scores
        for (const entry of alternatives) {
            const scores = entry.alternative_scores;

            for (const scoreEntry of scores) {
                const criteriaCode = scoreEntry.criteria_code;
                const { scores } = criteriaData[criteriaCode];
                const score = scoreEntry.score;

                // Menghitung jumlah rank yang sama dengan score untuk setiap kriteria
                const sameScoreRanks = scores.filter((entry) => entry.score === score).map((entry) => entry.rank);
                const sumRanks = sameScoreRanks.reduce((total, rank) => total + rank, 0);
                const rankCount = sameScoreRanks.length;

                // Menambahkan hasil rata-rata dan nilai rank ke properti "besson-rank" dan "rank"
                scoreEntry["besson_rank"] = sumRanks / rankCount;
            }
        }

        return alternatives
    }

    async distanceScore(bessonRank) {
        const alternatives = bessonRank;
        const R = 5

        alternatives.forEach((alternative) => {
            const scores = alternative.alternative_scores;
            Object.keys(scores).map((key) => {
              const P1 = 0.5 * Math.pow(scores[key]["besson_rank"], R);
              const P2 = 0.5 * Math.pow(Number(key) + 1, R);
          
              scores[key]["distance_score"] = Math.pow(P1 + P2, 1 / 5);
            });
        });

        return alternatives
    }
    
    async accumulateDistanceScore(distanceScore) {
        distanceScore.forEach((alternative) => {
            const scores = alternative.alternative_scores;
            const totalDistanceScore = scores.reduce((total, alternative) => {
                return total + alternative.distance_score;
            }, 0);
            alternative["accumulation"] = totalDistanceScore
        });

        return distanceScore
    }

    async ranking(accumulation) {
        // Buat salinan data agar data asli tidak terpengaruh
        const rankedData = [...accumulation];

        // Urutkan data alternatif berdasarkan `accumulation` dari yang terkecil ke terbesar
        rankedData.sort((a, b) => a.accumulation - b.accumulation);

        // Tambahkan rank pada setiap objek berdasarkan posisi mereka setelah diurutkan
        rankedData.forEach((alternative, index) => {
            alternative.rank = index + 1;
        });

        return rankedData
    }

    async getData(user) {
        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const transformedData = alternative.map((item) => {
            const alternative_scores = item.AlternativeScores.map((score) => {
                return {
                    id: score.id,
                    criteria_code: score.criteria.criteria_code,
                    score: score.subcriteria.sub_criteria_score
                };
            });

            if (alternative_scores.length === 0) {
                alternative_scores.push({
                    criteria_code: "",
                    score: ""
                });
            }

            return {
                id: item.id,
                alternative_name: item.alternative_name,
                alternative_scores: alternative_scores,
            };
        });

        // check isi alternative scores
        for (const data of transformedData) {
            if (data.alternative_scores.length === 1 && data.alternative_scores[0].criteria_code === "" && data.alternative_scores[0].score === "") {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        }

        return transformedData
    }

    async getAlternativeData(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const alternatives = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const alternativeScoresCounts = alternatives.map((alternative) => alternative.AlternativeScores.length);

        // Cek apakah semua panjang AlternativeScores sama
        const isAllSame = alternativeScoresCounts.every((count) => count === alternativeScoresCounts[0]);

        if (!isAllSame) {
            throw new ResponseError(400, "Penilaian belum dilakukan");
        }

        alternatives.map((item) => {
            if (!item.AlternativeScores || item.AlternativeScores.length === 0) {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            },
            take: request.size,
            skip
        });

        const transformedData = alternative.map((item) => {
            const alternative_scores = item.AlternativeScores.map((score) => {
                return {
                    criteria_code: score.criteria.criteria_code,
                    score: score.subcriteria.sub_criteria_score
                };
            });

            if (alternative_scores.length === 0) {
                alternative_scores.push({
                    criteria_code: "",
                    score: ""
                });
            }

            return {
                alternative_name: item.alternative_name,
                alternative_scores: alternative_scores
            };
        });

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        });

        // check isi alternative scores
        transformedData.map((item) => {
            if (item.alternative_scores.length === 1 
                || item.alternative_scores[0].criteria_code === "" 
                || item.alternative_scores[0].score === "") {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        return {
            data: transformedData,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }

    async getBessonRank(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const alternatives = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const alternativeScoresCounts = alternatives.map((alternative) => alternative.AlternativeScores.length);

        // Cek apakah semua panjang AlternativeScores sama
        const isAllSame = alternativeScoresCounts.every((count) => count === alternativeScoresCounts[0]);

        if (!isAllSame) {
            throw new ResponseError(400, "Penilaian belum dilakukan");
        }

        alternatives.map((item) => {
            if (!item.AlternativeScores || item.AlternativeScores.length === 0) {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        }
                    }
                }
            },
            take: request.size,
            skip
        });

        const bessonRank = alternative.map((item) => {
            const alternative_scores = item.AlternativeScores.map((score) => {
                return {
                    id: score.id,
                    criteria_code: score.criteria.criteria_code,
                    besson_rank: score.besson_rank
                };
            });

            if (alternative_scores.length === 0) {
                alternative_scores.push({
                    criteria_code: "",
                    score: ""
                });
            }

            return {
                id: item.id,
                alternative_name: item.alternative_name,
                alternative_scores: alternative_scores,
            };
        });

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        });

        bessonRank.map((item) => {
            if (item.alternative_scores.length === 1 
                || item.alternative_scores.length === 0 
                || item.alternative_scores[0].besson_rank === null
                ) {
                throw new ResponseError(400, "Perhitungan ORESTE belum dilakukan")
            }
        })

        return {
            data: bessonRank,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }

    async getDistanceScore(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const alternatives = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const alternativeScoresCounts = alternatives.map((alternative) => alternative.AlternativeScores.length);

        // Cek apakah semua panjang AlternativeScores sama
        const isAllSame = alternativeScoresCounts.every((count) => count === alternativeScoresCounts[0]);

        if (!isAllSame) {
            throw new ResponseError(400, "Penilaian belum dilakukan");
        }

        alternatives.map((item) => {
            if (!item.AlternativeScores || item.AlternativeScores.length === 0) {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        }
                    }
                }
            },
            take: request.size,
            skip
        });

        const distanceScore = alternative.map((item) => {
            const alternative_scores = item.AlternativeScores.map((score) => {
                return {
                    id: score.id,
                    criteria_code: score.criteria.criteria_code,
                    distance_score: score.distance_score
                };
            });

            if (alternative_scores.length === 0) {
                alternative_scores.push({
                    criteria_code: "",
                    score: ""
                });
            }

            return {
                id: item.id,
                alternative_name: item.alternative_name,
                alternative_scores: alternative_scores,
            };
        });

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        });

        distanceScore.map((item) => {
            if (item.alternative_scores.length === 1 
                || item.alternative_scores.length === 0 
                || item.alternative_scores[0].distance_score === null
                ) {
                throw new ResponseError(400, "Perhitungan ORESTE belum dilakukan")
            }
        })

        // distanceScore.map((item) => {
        //     console.info(item)
        //     const isEmpty = item.alternative_scores.some(item => item.criteria_code === '' || item.score === '')
        //     console.info(isEmpty)
        //     if (isEmpty) {
        //         throw new ResponseError(400, "Penilaian belum dilakukan")
        //     }
        // })

        return {
            data: distanceScore,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }

    async getAccumulation(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const alternatives = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const alternativeScoresCounts = alternatives.map((alternative) => alternative.AlternativeScores.length);

        // Cek apakah semua panjang AlternativeScores sama
        const isAllSame = alternativeScoresCounts.every((count) => count === alternativeScoresCounts[0]);

        if (!isAllSame) {
            throw new ResponseError(400, "Penilaian belum dilakukan");
        }

        alternatives.map((item) => {
            if (!item.AlternativeScores || item.AlternativeScores.length === 0) {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        }
                    }
                }
            },
            take: request.size,
            skip
        });

        const accumulationScores = alternative.map((item) => {
            return {
                id: item.id,
                alternative_name: item.alternative_name,
                accumulation_scores: item.accumulation_score,
            };
        });

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        });

        accumulationScores.map((item) => {
            if (item.accumulation_scores === 0 || item.accumulation_scores === null) {
                throw new ResponseError(400, "Perhitungan ORESTE belum dilakukan")
            }
        })

        return {
            data: accumulationScores,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }

    async getRank(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const alternatives = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        },
                        subcriteria: {
                            select: {
                                sub_criteria_score: true
                            }
                        }
                    }
                }
            }
        });

        const alternativeScoresCounts = alternatives.map((alternative) => alternative.AlternativeScores.length);

        // Cek apakah semua panjang AlternativeScores sama
        const isAllSame = alternativeScoresCounts.every((count) => count === alternativeScoresCounts[0]);

        if (!isAllSame) {
            throw new ResponseError(400, "Penilaian belum dilakukan");
        }

        alternatives.map((item) => {
            if (!item.AlternativeScores || item.AlternativeScores.length === 0) {
                throw new ResponseError(400, "Penilaian belum dilakukan")
            }
        })

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    include: {
                        criteria: {
                            select: {
                                criteria_code: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                rank: "asc"
            },
            take: request.size,
            skip
        });

        const accumulationScores = alternative.map((item) => {
            return {
                id: item.id,
                alternative_name: item.alternative_name,
                rank: item.rank,
            };
        });

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        });

        accumulationScores.map((item) => {
            if (item.accumulation_scores === 0 || item.accumulation_scores === null ) {
                throw new ResponseError(400, "Perhitungan ORESTE belum dilakukan")
            }
        })

        const rankedData = [...accumulationScores];

        rankedData.sort((a, b) => a.rank - b.rank);

        rankedData.map((item) => {
            if (item.rank === null ) {
                throw new ResponseError(400, "Perhitungan ORESTE belum dilakukan")
            }
        })

        return {
            data: rankedData,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }
}