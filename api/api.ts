import express from 'express'
import userRoutes from './routes/userRoutes.js'
import memoryLaneRoutes from './routes/memoryLaneRoutes.js'
import { eventRoutes } from './routes/eventRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler } from './middleware/error.js'
import prisma from './config/db.js'
import cors from 'cors'
import 'dotenv/config'
const app = express()
const port = 4001
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-uploadthing-version',
      'x-uploadthing-package',
      'x-uploadthing-id',
    ],
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/memory-lanes', memoryLaneRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/uploadthing', uploadRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
