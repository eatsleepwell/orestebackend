import alternativeValidation from "../validation/alternative-validation.js";
import {prismaClient} from "../config/database.js"
import ResponseError from "../error/response-error.js";

export default class AlternativeScore {

    async addAlternativeScore(user, alternative_id, request) {

        const arrayScore = []

        request.data.forEach((score) => {
            const newObj = {
              alternative_id: parseInt(alternative_id),
              criteria_id: parseInt(score.criteria_id),
              subcriteria_id: parseInt(score.subcriteria_id)
            };
            arrayScore.push(newObj);
          });

        const alternativeScoresWithId = request.data.map((score) => ({
            alternative_id: parseInt(alternative_id),
            criteria_id: parseInt(score.criteria_id),
            subcriteria_id: parseInt(score.subcriteria_id)
        }));


        const criteria = await prismaClient.criteria.findMany({
            where: {
                username: user.username
            }
        })

        const checkAlternativeId = await prismaClient.alternativeScores.findFirst({
            where: {
                alternative_id: alternative_id
            }
        })

        if(checkAlternativeId) {
            throw new ResponseError(400, "Skor alternatif telah ditambahkan sebelumnya");
        } if (arrayScore.length !== criteria.length) {
            throw new ResponseError(400, "Skor alternatif tidak boleh kosong");
        } else {
            return prismaClient.alternativeScores.createMany({
                data: alternativeScoresWithId
            })
        }
    }

    async updateAlternativeScore(user, alternative_id, request) {
        console.info(alternative_id)
        const arrayScore = []

        request.data.forEach((score) => {
            const newObj = {
              alternative_id: parseInt(alternative_id),
              criteria_id: parseInt(score.criteria_id),
              subcriteria_id: parseInt(score.subcriteria_id)
            };
            arrayScore.push(newObj);
        });

        const criteria = await prismaClient.criteria.findMany({
            where: {
                username: user.username
            }
        })

        if (arrayScore.length !== criteria.length) {
            throw new ResponseError(400, "Skor alternatif tidak boleh kosong");
        } 

        const alternativeScorePromises = arrayScore.map(async (item) => {
            const existingRecord = await prismaClient.alternativeScores.findFirst({
                where: {
                    alternative_id: item.alternative_id,
                    criteria_id: item.criteria_id
                }
            });
        
            if (existingRecord) {
                // Jika data sudah ada, lakukan update
                return prismaClient.alternativeScores.updateMany({
                    where: {
                        alternative_id: item.alternative_id,
                        criteria_id: item.criteria_id
                    },
                    data: {
                        criteria_id: item.criteria_id,
                        subcriteria_id: item.subcriteria_id
                    }
                });
            } else {
                // Jika data belum ada, lakukan penambahan
                return prismaClient.alternativeScores.create({
                    data: {
                        alternative_id: item.alternative_id,
                        criteria_id: item.criteria_id,
                        subcriteria_id: item.subcriteria_id
                    }
                });
            }
        });

        await Promise.all(alternativeScorePromises);

        return {message: "Penilaian berhasil dilakukan"}
    }

    async getAlternativeScore(user, request) {
        const alternativeValidate = new alternativeValidation();
        request = alternativeValidate.getAlternativeValidation(request)
        const skip = (request.page -1) * request.size;

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            include: {
                AlternativeScores: {
                    select: {
                        criteria: true,
                        subcriteria: true
                    }
                }
            },
            take: request.size,
            skip: skip
        })

        const criteria = await prismaClient.criteria.findMany({
            where: {
                username: user.username
            }
        })

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        })

        return {
            data: alternative,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        }
    }

    async getAlternativeScoreDetail(user, alternativeId, request) {

        const alternativeValidate = new alternativeValidation();
        request = alternativeValidate.getAlternativeValidation(request)
        const skip = (request.page -1) * request.size;

        const alternative = await prismaClient.alternative.findFirst({
            where: {
                id: alternativeId
            },
            include: {
                AlternativeScores: {
                    select: {
                        criteria: true,
                        subcriteria: true
                    }
                }
            },
            take: request.size,
            skip: skip
        })

        const totalItems = await prismaClient.alternative.count({
            where: {
                username: user.username
            }
        })

        console.info(alternative)

        return {
            data: alternative,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        }
    }
}