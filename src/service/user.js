import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import UserValidation from "../validation/user-validation.js"
import { v4 as uuid } from "uuid";

export default class User {
    async register(request) {
        const userValidation = new UserValidation();
        const user = await userValidation.registerValidation(request)

        user.password = await bcrypt.hash(user.password, 10)

        return prismaClient.user.create({
            data: {
                username: user.username,
                password: user.password,
                name: user.name
            },
            select: {
                username: true,
                name: true
            }
        })
    }

    async login(request) {
        const instance = new UserValidation();
        const user = await instance.loginValidation(request)
        const token = uuid().toString()

        return prismaClient.user.update({
            data: {
                token: token
            },
            where: {
                username: user.username
            },
            select: {
                username: true,
                name: true,
                token: true
            }
        })
    }

    async logout(username) {
        return prismaClient.user.update({
            where: {
                username: username
            },
            data: {
                token: null
            },
            select: {
                username: true
            }
        })
    }

    async authorization(req, res, next) {
        const token = req.get("Authorization")
        if (!token) {
            res.status(401).json({
                errors: "Pengguna belum login"
            }).end()
        } else {
            const user = await prismaClient.user.findFirst({
                where: {
                    token: token
                }
            })
            if (!user) {
                res.status(401).json({
                    errors: "Pengguna belum login"
                }).end()
            } else {
                req.user = user
                next()
            }
        }
    }
}