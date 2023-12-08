import Criteria from "../service/criteria.js"

const add = async (req, res, next) => {
    const instance = new Criteria()
    try {
        const user = req.user
        const request = req.body
        const result = await instance.addCriteria(user, request)
        res.status(200).json({
            data: result,
            message: "Criteria berhasil disimpan"
        })
    } catch(e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    const instance = new Criteria()
    try {
        const user = req.user
        const criteriaId = req.params.criteriaId
        const request = req.body
        request.id = criteriaId

        const result = await instance.updateCriteria(user, request)
        res.status(200).json({
            data: result,
            message: "Kriteria berhasil diubah"
        })
    } catch(e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    const instance = new Criteria()
    try {
        const data = req.body

        await instance.deleteCriteria(data)
        res.status(200).json({
            message: "Kriteria berhasil dihapus"
        })
    } catch(e) {
        next(e)
    }
}

const get = async(req, res, next) => {
    const instance = new Criteria()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getCriteria(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch(e) {
        next(e)
    }
}

export default {add, update, remove, get}