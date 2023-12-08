import User from "../service/user.js"

const register = async (req, res, next) => {
    const instance = new User()
    try {
        const result = await instance.register(req.body)
        res.status(200).json({
            data: result,
            message: "Registrasi berhasil"
        })
    } catch(e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    console.info("test")
    const instance = new User()
    try {
        const result = await instance.login(req.body)
        res.status(200).json({
            data: result,
            message: "Login berhasil"
        })
    } catch(e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    const instance = new User()
    try {
        await instance.logout(req.user.username);
        res.status(200).json({
            data: "Logout berhasil"
        });
    } catch (e) {
        next(e);
    }
}


export default {register, login, logout}