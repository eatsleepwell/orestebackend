import { prismaClient } from "../application/database.js";
import ResultValidation from "../validation/result-validation.js";

export default class Result {
    
    async saveResult(user, request) {
        const resultValidation = new ResultValidation();
        request = await resultValidation.saveResultValidation(request);
        const ranks = await this.getRanks(user);
        console.info(ranks)

        await prismaClient.results.create({
            data: {
                result_name: request.name,
                username: user.username,
                result: {
                    createMany: {
                        data: ranks
                    }
                }
            }
        })
    }

    async getRanks(user, request) {

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
            }
        });

        const accumulationScores = alternative.map((item) => {
            return {
                alternative_name: item.alternative_name,
                rank: item.rank,
            };
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

        return rankedData
    }

    async getResults(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const results = await prismaClient.results.findMany({
            where: {
                username: user.username
            },
            orderBy: {
                date: "desc"
            },
            take: request.size,
            skip
        })

        if(results.length === 0) {
            throw new Error("Data tidak dapat ditemukan");
        }

        const totalItems = await prismaClient.results.count({
            where: {
                username: user.username
            }
        });

        const formattedResults = results.map(result => {
            const date = new Date(result.date);
            const formattedDate = date.toISOString().split('T')[0]; // Mengambil bagian tanggal
            return {
                ...result,
                date: formattedDate
            };
        });

        return {
            formattedResults,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }

    async downloadResult(user, request) {
        const name = await prismaClient.user.findFirst({
            where: {
                username: user.username
            },
            select: {
                name: true
            }
        })

        const results = await prismaClient.results.findMany({
            where: {
                username: user.username,
                id: parseInt(request.resultId)
            },
            include: {
                result: {
                    select: {
                        id: true,
                        alternative_name: true,
                        rank: true
                    },
                    orderBy: {
                        rank: 'asc'
                    }
                }
            }
        })

        if(results.length === 0) {
            throw new Error("Data tidak dapat ditemukan");
        }

        const result = results.map(result => ({
            name: name.name,
            ...result
        }));

        return result
    }

    async getResult(user, request) {
        request.size = 10;
        request.page = parseInt(request.page);
        const skip = (request.page - 1) * request.size;

        const results = await prismaClient.result.findMany({
            where: {
                results_id: parseInt(request.resultId)
            },
            select: {
                alternative_name: true,
                rank: true
            },
            take: request.size,
            skip
        })

        if(results.length === 0) {
            throw new Error("Data tidak dapat ditemukan");
        }

        const totalItems = await prismaClient.result.count({
            where: {
                results_id: parseInt(request.resultId)
            }
        });

        return {
            results,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        };
    }
}