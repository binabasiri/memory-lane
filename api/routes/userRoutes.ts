import express, { RequestHandler } from 'express'
import { createUser, login } from '../controllers/userController.js'

const userRoutes = express.Router()

userRoutes.post('/signup', createUser as RequestHandler)

userRoutes.post('/login', login as RequestHandler)

export default userRoutes
