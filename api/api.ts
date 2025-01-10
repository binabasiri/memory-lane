import express from 'express'
import userRoutes from './routes/userRoutes.js'
import memoryLaneRoutes from './routes/memoryLaneRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import { errorHandler } from './middleware/error.js'
import prisma from './config/db.js'

const app = express()
const port = 4001

app.use(express.json())

// Routes
app.use('/users', userRoutes)
app.use('/users/:userId/memory-lanes', memoryLaneRoutes)
app.use('/memory-lanes/:memoryLaneId/events', eventRoutes)

// Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Cleanup Prisma when the server shuts down
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
