import Joi from "joi";
import ResponseError from "../error/response-error.js";
import {prismaClient} from "../config/database.js"

export default class SubCriteriaValidation{
    
    async addSubCriteriavalidation(criteriaId, request) {
        const addSubCriteriaValidation = Joi.object({
            sub_criteria_name: Joi.string().empty().required().messages({
                'string.empty' : 'Sub kriteria tidak boleh kosong'
            }),
            sub_criteria_score: Joi.number().min(1).positive().empty().required().messages({
                'string.empty' : 'Skor sub kriteria tidak boleh kosong'
            })
        })

        const result = addSubCriteriaValidation.validate(request, {
            abortEarly: false,
            allowUnknown: false
        })

        let capitalized = result.value.sub_criteria_name.charAt(0).toUpperCase() + result.value.sub_criteria_name.slice(1)
        result.value.sub_criteria_name = capitalized

        result.value.criteria_id = parseInt(criteriaId)
    
        const countSubCriteriaName = await prismaClient.subCriteria.count({
            where: {
                criteria_id: criteriaId,
                sub_criteria_name: result.value.sub_criteria_name
            }
        })

        if(countSubCriteriaName === 1) {
            throw new ResponseError(400, "Sub kriteria tidak boleh sama")
        }

        const countSubCriteriaScore = await prismaClient.subCriteria.count({
            where: {
                criteria_id: criteriaId,
                sub_criteria_score: result.value.sub_criteria_score
            }
        })

        if(countSubCriteriaScore === 1) {
            throw new ResponseError(400, "Sub kriteria score tidak boleh sama")
        }

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

    async updateCriteriaValidation(criteriaId, subCriteriaId, request) {
        const addSubCriteriaValidation = Joi.object({
            sub_criteria_name: Joi.string().empty().required().messages({
                'string.empty' : 'Sub kriteria tidak boleh kosong'
            }),
            sub_criteria_score: Joi.number().min(1).positive().empty().required().messages({
                'string.empty' : 'Skor sub kriteria tidak boleh kosong'
            })
        })

        const result = addSubCriteriaValidation.validate(request, {
            abortEarly: false,
            allowUnknown: false
        })

        let capitalized = result.value.sub_criteria_name.charAt(0).toUpperCase() + result.value.sub_criteria_name.slice(1)
        result.value.sub_criteria_name = capitalized

        result.value.subcriteria_id = parseInt(subCriteriaId)
        criteriaId = parseInt(criteriaId)

        const checkSubCriteriaName = await prismaClient.subCriteria.findFirst({
            where: {
                criteria_id: criteriaId,
                sub_criteria_name: result.value.sub_criteria_name
            }
        })

        // Menghapus spasi di depan sub_criteria_name
        if (typeof result.value.sub_criteria_name === 'string') {
            result.value.sub_criteria_name = result.value.sub_criteria_name.replace(/^\s+/, '');
        }
        
        // Menghapus spasi di depan sub_criteria_score
        if (typeof result.value.sub_criteria_score === 'string') {
            result.value.sub_criteria_score = result.value.sub_criteria_score.replace(/^\s+/, '');
        }


        if(checkSubCriteriaName && checkSubCriteriaName.id !== result.value.subcriteria_id) {
                throw new ResponseError(400, "Sub kriteria tidak boleh sama")
        }

        const checkSubCriteriaScore = await prismaClient.subCriteria.findFirst({
            where: {
                criteria_id: criteriaId,
                sub_criteria_score: result.value.sub_criteria_score
            }
        })

        if(checkSubCriteriaScore && checkSubCriteriaScore.id !== result.value.subcriteria_id) {
            throw new ResponseError(400, "Sub kriteria score tidak boleh sama")
        }

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

    async deleteSubCriteriaValidation(data) {

        const deleteSchema = Joi.object({
            sub_criteria_id: Joi.array().min(1).message({
                'array.min' : 'Data tidak boleh kosong'
            }).items(
                Joi.number().positive().messages({
                    'number.base': 'Data harus berupa angka',
                    'number.positive': 'Data harus lebih besar dari 0'
                }))
        })

        const result = deleteSchema.validate(data, {
            abortEarly: false,
            allowUnknown: false
        })

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

    getSubCriteriaValidation(request) {
        const getCriteraValidation = Joi.object({
            page: Joi.number().min(1).positive().default(1),
            size: Joi.number().min(1).positive().default(10),
        })

        const result = getCriteraValidation.validate(request, {
            abortEarly:false,
            allowUnknown: false
        })

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        } 
    }

    checkCriteriaValidation(request) {
        const checkCriteriaValidation = Joi.number().positive().required();

        const result = checkCriteriaValidation.validate(request, {
            abortEarly:false,
            allowUnknown: false
        })

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        } 
    }
}