import Result from "../service/result.js"

const saveResult = async (req, res, next) => {
    const instance = new Result()
    try {
        const user = req.user
        const request = req.body
        const result = await instance.saveResult(user, request)
        res.status(200).json({
            message: "Hasil perhitungan berhasil disimpan",
            data: result
        })
    } catch(e) {
        next(e)
    }
}

const getResults = async (req, res, next) => {
    const instance = new Result()
    try {
        const user = req.user
        const request = {
            page: req.query.page,
            size: req.query.size
        }
        const result = await instance.getResults(user, request)
        res.status(200).json({
            message: "Data berhasil didapatkan",
            data: result
        })
    } catch(e) {
        next(e)
    }
}

const getResult = async (req, res, next) => {
    const instance = new Result()
    try {
        const user = req.user

        const request = {
            resultId: req.params.resultId,
            page: req.query.page
        }
        console.info(req.params)
        const result = await instance.getResult(user, request)
        res.status(200).json({
            message: "Data berhasil didapatkan",
            data: result
        })
    } catch(e) {
        next(e)
    }
}

const downloadResult = async (req, res, next) => {
    const instance = new Result();
  
    try {
      const user = req.user;
      const request = req.params;
      const result = await instance.downloadResult(user, request);
  
      res.status(200).json({
        message: "Data berhasil didapatkan",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

export default {
    saveResult,
    getResults,
    getResult,
    downloadResult
}