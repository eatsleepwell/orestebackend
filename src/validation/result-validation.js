import Joi from "joi";
import ResponseError from "../error/response-error.js";

export default class ResultValidation {
  async saveResultValidation(request) {
    const registerData = Joi.object({
      name: Joi.string().empty().required().messages({
        "string.empty": "Nama tidak boleh kosong",
      }),
    });

    const result = registerData.validate(request, {
      allowUnknown: false,
    });

    if (result.error) {
      throw new ResponseError(400, result.error.message);
    } else {
      return result.value;
    }
  }
}
