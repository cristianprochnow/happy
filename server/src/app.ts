import express from 'express'
import path from 'path'
import cors from 'cors'
import errorHandler from './errors/handler'
import { routes } from './routes'
import 'express-async-errors'
import './database/connection'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

export { app }
