import Joi from 'joi'
import ResponseError from "../error/response-error.js";
import { prismaClient } from "../config/database.js"

export default class criteriaValidation {

    async addCriteriaValidation(user, request) {
        const criteria = Joi.object({
            criteria_name: Joi.string().empty().required().messages({
                'string.empty' : 'Kriteria tidak boleh kosong'
            }),
            criteria_code: Joi.string().empty().required().messages({
                'string.empty' : 'Kode Kriteria tidak boleh kosong'
            })
        })

        const result = criteria.validate(request, {
            allowUnknown: false
        })

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } 

        let capitalized = result.value.criteria_name.charAt(0).toUpperCase() + result.value.criteria_name.slice(1)
        result.value.criteria_name = capitalized
        capitalized = result.value.criteria_code.charAt(0).toUpperCase() + result.value.criteria_code.slice(1)
        result.value.criteria_code = capitalized

        const countCriteriaName = await prismaClient.criteria.count({
            where: {
                username: user.username,
                criteria_name: result.value.criteria_name
            }
        })
        
        if(countCriteriaName === 1) {
            throw new ResponseError(400, "Kriteria tidak boleh sama")
        }

        const countCriteriaCode = await prismaClient.criteria.count({
            where: {
                username: user.username,
                criteria_code: result.value.criteria_code
            }
        })
        
        if(countCriteriaCode === 1) {
            throw new ResponseError(400, "Kode kriteria tidak boleh sama")
        }

        return result.value
    }

    
    async updateCriteriaValidation(user, request) {
        const criteria = Joi.object({
            id: Joi.number().positive().required(),
            criteria_name: Joi.string().empty().required().messages({
                'string.empty' : 'Kriteria tidak boleh kosong'
            }),
            criteria_code: Joi.string().empty().required().messages({
                'string.empty' : 'Kode Kriteria tidak boleh kosong'
            })
        })

        const result = criteria.validate(request, {
            allowUnknown: false
        })

        let capitalized = result.value.criteria_name.charAt(0).toUpperCase() + result.value.criteria_name.slice(1)
        result.value.criteria_name = capitalized
        capitalized = result.value.criteria_code.charAt(0).toUpperCase() + result.value.criteria_code.slice(1)
        result.value.criteria_code = capitalized

        const checkCriteriaName = await prismaClient.criteria.findFirst({
            where: {
                username: user.username,
                criteria_name: result.value.criteria_name
            }
        })

        if(checkCriteriaName && checkCriteriaName.id !== result.value.id) {
            throw new ResponseError(400, "Kriteria tidak boleh sama dengan kriteria lainnya")
        }

        const checkCriteriaCode = await prismaClient.criteria.findFirst({
            where: {
                username: user.username,
                criteria_code: result.value.criteria_code
            }
        })

        if(checkCriteriaCode && checkCriteriaCode.id !== result.value.id) {
            throw new ResponseError(400, "Kode kriteria tidak boleh sama dengan kode kriteria lainnya")
        }
        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        } 
    }

    getCriteriaValidation(request) {
        const getCriteraValidation = Joi.object({
            page: Joi.number().min(1).positive().default(1),
            size: Joi.number().min(1).positive().default(10),
        })

        const result = getCriteraValidation.validate(request, {
            allowUnknown: false
        })

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        } 
    }
}