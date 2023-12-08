import express from "express";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {publicRouter} from "../route/public-api.js"
import {userRouter} from "../route/api.js"
import cors from 'cors'; 

export const app = express();
app.use(cors())
app.use(express.json())
app.use(publicRouter)
app.use(userRouter)

app.use(errorMiddleware)