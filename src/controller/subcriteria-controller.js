import SubCriteria from "../service/sub-criteria.js"

const add = async (req, res, next) => {
    const instance = new SubCriteria()
    try {
        const request = req.body
        const criteriaId = req.params.criteriaId

        const result = await instance.addSubCriteria(criteriaId, request)
        res.status(200).json({
            data: result,
            message: "Sub kriteria berhasil disimpan"
        })
    } catch(e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    const instance = new SubCriteria()
    try {
        const request = req.body
        const criteriaId = req.params.criteriaId
        const subCriteriaId = req.params.subCriteriaId

        const result = await instance.updateSubCriteria(criteriaId, subCriteriaId, request)
        res.status(200).json({
            data: result,
            message: "Sub kriteria berhasil diubah"
        })
    } catch(e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    const instance = new SubCriteria()
    try {
        const data = req.body

        await instance.deleteSubCriteria(data)
        res.status(200).json({
            message: "Sub kriteria berhasil dihapus"
        })
    } catch(e) {
        next(e)
    }
}

const get = async(req, res, next) => {
    const instance = new SubCriteria()
    try {
        const user = req.user
        const criteriaId = req.params.criteriaId
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getSubCriteria(user, criteriaId, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch(e) {
        next(e)
    }
}

export default {add, update, remove, get}