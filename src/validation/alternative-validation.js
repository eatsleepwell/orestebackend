import Joi from 'joi'
import ResponseError from "../error/response-error.js";

export default class alternativeValidation {

    addAlternativeValidation(request) {
        const alternative = Joi.object({
            alternative_name: Joi.string().empty( ).required().messages({
                'string.empty' : 'Alternatif tidak boleh kosong'
            })
        }).empty().required().min(1).messages({
            'string.empty' : 'Alternatif tidak boleh kosong'
        })

        const result = alternative.validate(request, {
            abortEarly:false,
            allowUnknown: false
        })

        let capitalized = result.value.alternative_name.charAt(0).toUpperCase() + result.value.alternative_name.slice(1)
        result.value.alternative_name = capitalized

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        } 
    }

    updateAlternativeValidation(request) {
        console.info(request)
        const alternative = Joi.object({
            id: Joi.number().positive().required(),
            alternative_name: Joi.string().empty().required().messages({
                'string.empty' : 'Alternatif tidak boleh kosong'
            })
        })

        const result = alternative.validate(request, {
            abortEarly:false,
            allowUnknown: false
        })
        
        let capitalized = result.value.alternative_name.charAt(0).toUpperCase() + result.value.alternative_name.slice(1)
        result.value.alternative_name = capitalized

        if(result.error) {
            throw new ResponseError(400, result.error.message)
        } else {
            return result.value
        }
    }

    getAlternativeValidation(request) {
        const getAltenativeValidation = Joi.object({
            page: Joi.number().min(1).positive().default(1),
            size: Joi.number().min(1).positive().max(100).default(10),
        })

        const result = getAltenativeValidation.validate(request, {
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