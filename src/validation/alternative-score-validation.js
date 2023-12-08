import Joi from "joi";
import ResponseError from "../error/response-error.js";

export default class AlternatifScoreValidation{
    
    async addAlternativeScoreValidation(request) {

        const alternativeScoreValidation = Joi.object({
            alternative_id: Joi.number().positive().required(),
            criteria_id: Joi.number().positive().required(),
            subcriteria_id: Joi.number().positive().required()
        })

        const result = alternativeScoreValidation.validate(request, {
            allowUnknown: false
        })

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

    async updateAlternativeScoreValidation(request) {

        const alternativeScoreValidation = Joi.object({
            data: Joi.array().items(
                Joi.object({
                    criteria_id: Joi.number().positive().required(),
                    subcriteria_id: Joi.number().positive().required(),
                    criteria_name: Joi.string().empty().required().messages({
                        'string.empty' : 'Kriteria tidak boleh kosong'
                    }),
                    score: Joi.number().positive().empty().required().messages({
                        'string.empty' : 'Skor Alternatif tidak boleh kosong'
                    }),
                    criteria_code: Joi.string().empty().required().messages({
                        'string.empty' : 'Kode Kriteria tidak boleh kosong'
                    })
                })
            )
        })

        const result = alternativeScoreValidation.validate(request, {
            abortEarly: false,
            allowUnknown: false
        })

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

}