import express, { RequestHandler } from 'express'
import {
  createMemoryLane,
  getMemoryLane,
  updateMemoryLane,
} from '../controllers/memoryLaneController.js'
import { memoryLaneEventsRoutes } from './eventRoutes.js'
import type {
  CreateMemoryLaneBody,
  MemoryLane,
  MemoryLaneRouteParams,
  ErrorResponse,
  UpdateMemoryLaneBody,
} from '../types/index.js'

const memoryLaneRoutes = express.Router({ mergeParams: true })

memoryLaneRoutes.post(
  '/',
  createMemoryLane as RequestHandler<
    {},
    MemoryLane | ErrorResponse,
    CreateMemoryLaneBody
  >
)

memoryLaneRoutes.get(
  '/:memoryLaneId',
  getMemoryLane as RequestHandler<
    MemoryLaneRouteParams,
    MemoryLane | ErrorResponse
  >
)

memoryLaneRoutes.put(
  '/:memoryLaneId',
  updateMemoryLane as RequestHandler<
    MemoryLaneRouteParams,
    MemoryLane | ErrorResponse,
    UpdateMemoryLaneBody
  >
)

memoryLaneRoutes.use('/:memoryLaneId/events', memoryLaneEventsRoutes)

export default memoryLaneRoutes
