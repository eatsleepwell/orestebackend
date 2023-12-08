import Alternative from "../service/alternative.js"

const add = async (req, res, next) => {
    const instance = new Alternative()
    try {
        const user = req.user
        const request = req.body
        const result = await instance.addAlternative(user, request)
        res.status(200).json({
            data: result,
            message: "Alternative berhasil ditambahkan"
        })
    } catch(e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    const instance = new Alternative()
    try {
        const request = req.body
        request.id = req.params.alternativeId

        const result = await instance.updateAlternative(request)
        res.status(200).json({
            data: result,
            message: "Alternative berhasil diubah"
        })
    } catch(e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    const instance = new Alternative()
    try {
        const data = req.body

        await instance.removeAlternative(data)
        res.status(200).json({
            message: "Alternative berhasil dihapus"
        })
    } catch(e) {
        next(e)
    }
}

const get = async(req, res, next) => {
    const instance = new Alternative()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getAlternative(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch(e) {
        next(e)
    }
}

export default {add, update, remove, get}