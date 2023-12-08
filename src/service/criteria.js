import { prismaClient } from "../application/database.js";
import criteriaValidation from "../validation/criteria-validation.js";
import ResponseError from "../error/response-error.js";

export default class Criteria {

    async addCriteria(user, request) {
        
        const criteriaValidated = new criteriaValidation();
        const criteria = await criteriaValidated.addCriteriaValidation(user, request)
        
        criteria.username = user.username
    
        return prismaClient.criteria.create({
            data: criteria,
            select: {
                id: true,
                criteria_name: true,
                criteria_code: true
            }
        })
    }

    async updateCriteria(user, request) {
        const criteriaValidated = new criteriaValidation();
        const criteria = await criteriaValidated.updateCriteriaValidation(user, request);
        
        return prismaClient.criteria.update({
            where: {
                id: criteria.id
            },
            data: {
                criteria_name: criteria.criteria_name,
                criteria_code: criteria.criteria_code
            },
            select: {
                id: true,
                criteria_name: true,
                criteria_code: true
            }
        })
    }

    async getCriteria(user, request) {
        const criteriaValidated = new criteriaValidation();
        request = criteriaValidated.getCriteriaValidation(request)

        const skip = (request.page -1) * request.size;

        const criteria = await prismaClient.criteria.findMany({
            where: {
                username: user.username
            },
            take: request.size,
            skip: skip
        })

        const totalItems = await prismaClient.criteria.count({
            where: {
                username: user.username
            }
        })

        return {
            data: criteria,
            paging: {
                page: request.page,
                totalItems: totalItems,
                total_page: Math.ceil(totalItems / request.size)
            }
        }
    }

    async deleteCriteria(data) {
        const deleteSubCriteria = prismaClient.subCriteria.deleteMany({
            where: {
                criteria_id: {
                    in: data.criteria_id
                }
            }
        })
        
        const deleteCriteria = prismaClient.criteria.deleteMany({
            where: {
                id: {
                    in: data.criteria_id
                }
            }
        })

        const deleteAlternativeScores = prismaClient.alternativeScores.deleteMany({
            where: {
                criteria_id: {
                    in: data.criteria_id
                }
            }
        })

        const checkIdCriteria = await prismaClient.criteria.count({
            where: {
                id: {
                    in: data.criteria_id
                }
            }
        })
        
        if(checkIdCriteria === data.criteria_id.length) {
            return await prismaClient.$transaction([ deleteAlternativeScores, deleteSubCriteria,deleteCriteria])
        } else {
            throw new ResponseError(400, "Kriteria tidak dapat ditemukan")
        }
    }
}