import express from "express";
import userController from "../controller/user-controller.js"
import criteriaController from "../controller/criteria-controller.js"
import subcriteriaController from "../controller/subcriteria-controller.js";
import alternativeController from "../controller/alternative-controller.js";
import oresteController from "../controller/oreste-controller.js";
import alternativescoreController from "../controller/alternativescore-controller.js";
import resultController from "../controller/result-controller.js";
import User from "../service/user.js";
import cors from 'cors'; 

const user = new User()
const userRouter = new express.Router();
userRouter.use(user.authorization)

// User Api
userRouter.delete('/api/users/logout', userController.logout)

// Criteria 
userRouter.post('/api/criteria', criteriaController.add)
userRouter.put('/api/criteria/:criteriaId', criteriaController.update)
userRouter.get('/api/criteria', criteriaController.get)
userRouter.delete('/api/criteria', criteriaController.remove)

// Sub Criteria Api
userRouter.post('/api/criteria/:criteriaId/sub-criteria', subcriteriaController.add)
userRouter.put('/api/criteria/:criteriaId/sub-criteria/:subCriteriaId', subcriteriaController.update)
userRouter.get('/api/sub-criteria/:criteriaId', subcriteriaController.get)
userRouter.delete('/api/sub-criteria', subcriteriaController.remove)

// Alternative Api
userRouter.post('/api/alternative', alternativeController.add)
userRouter.put('/api/alternative/:alternativeId', alternativeController.update)
userRouter.get('/api/alternative', alternativeController.get)
userRouter.delete('/api/alternative', alternativeController.remove)

// Alternative Score Api
userRouter.post('/api/alternativescore/:alternativeId', alternativescoreController.add)
userRouter.put('/api/alternativescore/:alternativeId', alternativescoreController.update)
userRouter.get('/api/alternativescore/', alternativescoreController.get)
userRouter.get('/api/alternativescore/:alternativeId', alternativescoreController.getDetail)

// ORESTE Api
userRouter.post('/api/oreste/calculate-oreste', oresteController.calculateOreste)
userRouter.get('/api/oreste/alternative-data', oresteController.getAlternativeData)
userRouter.get('/api/oreste/besson-rank', oresteController.getBessonRank)
userRouter.get('/api/oreste/distance-scores', oresteController.getDistanceScores)
userRouter.get('/api/oreste/accumulation-scores', oresteController.getAccumulationScores)
userRouter.get('/api/oreste/ranks', oresteController.getRanks)

// Result Api
userRouter.post('/api/result', resultController.saveResult)
userRouter.get('/api/results', resultController.getResults)
userRouter.get('/api/result/:resultId', resultController.getResult)
userRouter.get("/api/result/download/:resultId",resultController.downloadResult);

export {userRouter}