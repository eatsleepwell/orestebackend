import { prismaClient } from "../application/database.js";
import alternativeValidation from "../validation/alternative-validation.js";
import ResponseError from "../error/response-error.js";

export default class Alternative {

    async addAlternative(user, request) {
        const alternativeValidate = new alternativeValidation();
        const data = await alternativeValidate.addAlternativeValidation(request)
        data.username = user.username
        return prismaClient.alternative.create({
            data: data,
            select: {
                id: true,
                alternative_name: true
            }
        })
    }

    async updateAlternative(request) {
        console.info(request)
        const alternativeValidate = new alternativeValidation();
        const data = await alternativeValidate.updateAlternativeValidation(request);
        
        return prismaClient.alternative.update({
            where: {
                id: data.id
            },
            data: {
                alternative_name: data.alternative_name
            },
            select: {
                id: true,
                alternative_name: true
            }
        })

    }

    async getAlternative(user, request) {
        const alternativeValidate = new alternativeValidation();
        request = alternativeValidate.getAlternativeValidation(request)
        const skip = (request.page -1) * request.size;

        const alternative = await prismaClient.alternative.findMany({
            where: {
                username: user.username
            },
            take: request.size,
            skip: skip
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

    async removeAlternative(data) {

        const deleteAlternativeScores = prismaClient.alternativeScores.deleteMany({
            where: {
                alternative_id: {
                    in: data.alternative_id
                }
            }
        })

        const deleteAlternative = prismaClient.alternative.deleteMany({
            where: {
                id: {
                    in: data.alternative_id
                }
            }
        })

        const checkIdAlternative = await prismaClient.alternative.count({
            where: {
                id: {
                    in: data.alternative_id
                }
            }
        })
        
        if(checkIdAlternative === data.alternative_id.length) {
            return await prismaClient.$transaction([deleteAlternativeScores, deleteAlternative])
        } else {
            throw new ResponseError(400, "Alternatif tidak dapat ditemukan")
        }
    }
}