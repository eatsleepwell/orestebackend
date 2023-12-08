import SubCriteriaValidation from "../validation/sub-criteria-validation.js"
import ResponseError from "../error/response-error.js";
import { prismaClient } from "../application/database.js";

export default class SubCriteria {

    async addSubCriteria(criteriaId, request) {
        const instance = new SubCriteriaValidation();
        const subCriteria = await instance.addSubCriteriavalidation(parseInt(criteriaId), request)

        return prismaClient.subCriteria.create({
            data: subCriteria,
            select: {
                id: true,
                sub_criteria_name: true,
                sub_criteria_score: true,
            }
        })
    }

    async updateSubCriteria(criteriaId, subCriteriaId, request) {
        console.info(request)
        const update = new SubCriteriaValidation();
        const subCriteria = await update.updateCriteriaValidation(criteriaId, subCriteriaId, request)

        return prismaClient.subCriteria.update({
            where: {
                id: subCriteria.subcriteria_id
            },
            data: {
                sub_criteria_name: subCriteria.sub_criteria_name,
                sub_criteria_score: subCriteria.sub_criteria_score
            },
            select: {
                id: true,
                sub_criteria_name: true,
                sub_criteria_score: true
            }
        })
    }

    async getSubCriteria(user, criteriaId, request) {
        const instance = new SubCriteriaValidation();
        request = instance.getSubCriteriaValidation(request)
        criteriaId = instance.checkCriteriaValidation(criteriaId)

        const skip = (request.page -1) * request.size;

        const subCriteria = await prismaClient.subCriteria.findMany({
            where: {
                criteria_id: criteriaId
            },
            take: request.size,
            skip: skip
        })

        const totalItems = await prismaClient.subCriteria.count({
            where: {
                criteria_id: criteriaId
            }
        })

        if(totalItems === 0) {
            throw new ResponseError(400, "Sub kriteria kosong")
        }

        const result = {
            data: subCriteria,
            paging: {
              page: request.page, 
              total_item: totalItems,
              total_page: Math.ceil(totalItems / request.size)
            }
        }

        return result
    }

    async deleteSubCriteria(data) {
        const instance = new SubCriteriaValidation();
        data = await instance.deleteSubCriteriaValidation(data)

        const cekIdSubCriteria = await prismaClient.subCriteria.count({
            where: {
                id: {
                    in: data.sub_criteria_id
                }
            }
        })

        const deleteAlternativeScores = await prismaClient.alternativeScores.deleteMany({
            where: {
                subcriteria_id: {
                    in: data.sub_criteria_id
                }
            }
        })
        
        if(cekIdSubCriteria === data.sub_criteria_id.length) {
            const deleteAlternativeScores = prismaClient.alternativeScores.deleteMany({
                where: {
                    subcriteria_id: {
                        in: data.sub_criteria_id
                    }
                }
            })
            const deleteSubCriteria = prismaClient.subCriteria.deleteMany({
                where: {
                    id: {
                        in: data.sub_criteria_id
                    }
                }
            })

            return await prismaClient.$transaction([ deleteAlternativeScores, deleteSubCriteria])
        } else {
            throw new ResponseError(400, "Sub kriteria tidak dapat ditemukan")
        }
    }
}