import AlternativeScore from "../service/alternative-score.js"

const add = async (req, res, next) => {
    const user = req.user
    const instance = new AlternativeScore()
    try {
        const request = req.body
        const alternative_id = parseInt(req.params.alternativeId)
        
        const result = await instance.addAlternativeScore(user, alternative_id, request)
        res.status(200).json({
            data: result,
            message: "Penilaian berhasil disimpan"
        })
    } catch(e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    const user = req.user
    const instance = new AlternativeScore()
    try {
        const request = req.body
        const alternative_id = parseInt(req.params.alternativeId)

        const result = await instance.updateAlternativeScore(user, alternative_id, request)
        res.status(200).json({
            data: result,
            message: "Penilaian berhasil diubah"
        })
    } catch(e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    const user = req.user
    const instance = new AlternativeScore()
    try {
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getAlternativeScore(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch(e) {
        next(e)
    }
}

const getDetail = async(req, res, next) => {
    const user = req.user
    const instance = new AlternativeScore()
    try {
        const request = {
            page: req.query.page,
            size: req.query.size
        }
        const alternativeId = parseInt(req.params.alternativeId)
        const result = await instance.getAlternativeScoreDetail(user, alternativeId, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch(e) {
        next(e)
    }
}

export default {add, get, update, getDetail}