import Oreste from "../service/oreste.js"

const calculateOreste = async (req, res, next) => {
    const instance = new Oreste()
    console.info("test")
    try {
        const user = req.user
        const result = await instance.calculateOreste(user)

        res.status(200).json({
            message: "Perhitungan berhasil dilakukan",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getAlternativeData = async (req, res, next) => {
    const instance = new Oreste()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getAlternativeData(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (e) {
        next(e)
    }
}

const getBessonRank = async (req, res, next) => {
    const instance = new Oreste()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getBessonRank(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (e) {
        next(e)
    }
}

const getDistanceScores = async (req, res, next) => {
    const instance = new Oreste()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getDistanceScore(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (e) {
        next(e)
    }
}

const getAccumulationScores = async (req, res, next) => {
    const instance = new Oreste()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getAccumulation(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (e) {
        next(e)
    }
}

const getRanks = async (req, res, next) => {
    const instance = new Oreste()

    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }

        const result = await instance.getRank(user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (e) {
        next(e)
    }
}

export default {
    calculateOreste,
    getAlternativeData,
    getBessonRank,
    getDistanceScores,
    getAccumulationScores,
    getRanks
}