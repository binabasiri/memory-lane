import express from 'express'
import { uploadRouter } from '../controllers/uploadController.js'
import { createRouteHandler } from 'uploadthing/express'

const uploadRoutes = express.Router()

const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
})

uploadRoutes.use('/', uploadthingHandler)

export default uploadRoutes
export type OurFileRouter = typeof uploadRouter
