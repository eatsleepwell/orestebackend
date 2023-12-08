import Joi from 'joi'
import ResponseError from "../error/response-error.js";
import {prismaClient} from "../config/database.js"
import bcrypt from "bcrypt";

export default class UserValidation {

    async registerValidation(request) {
        const registerData = Joi.object({
            username: Joi.string().min(4).empty().required().messages({
                'string.empty' : 'Username tidak boleh kosong',
                'string.min' : 'Panjang username minimal {{#limit}} karakter',
            }),
            password: Joi.string().min(4).empty().required().messages({
                'string.empty' : 'Password tidak boleh kosong',
                'string.min' : 'Panjang password minimal {{#limit}} karakter',
            }),
            confirmPassword: Joi.string().empty().required().messages({
                'string.empty' : 'Password konfirmasi tidak boleh kosong'
            }),
            name: Joi.string().min(4).empty().required().messages({
                'string.empty' : 'Nama tidak boleh kosong',
                'string.min' : 'Panjang nama minimal {{#limit}} karakter',
            }),
        }).custom((value, helpers) => {
            if(value.password !== value.confirmPassword) {
                return helpers.error('register.password.different')
            }
            return value
        }).messages({
            'register.password.different' : 'Password dan passsword konfirmasi berbeda'
        });

        const result = registerData.validate(request, {
            allowUnknown: false
        })

        const countUser = await prismaClient.user.count({
            where: {
                username: result.value.username
            }
        })

        if(countUser === 1) {
            throw new ResponseError(400, "Username telah terdaftar");
        }

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

    async loginValidation(request) {
        const user = await prismaClient.user.findUnique({
            where: {
                username: request.username
            },
            select: {
                username: true,
                password: true
            }
        })

        if (!user) {
            throw new ResponseError(401, "Username tidak terdaftar")
        }

        const isPasswordValid = await bcrypt.compare(request.password, user.password)
        if (!isPasswordValid) {
            throw new ResponseError(401, "Password salah")
        }
        
        return user
    }
} 