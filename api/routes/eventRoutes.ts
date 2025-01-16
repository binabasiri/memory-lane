import express, { RequestHandler } from 'express'
import {
  createEvent,
  getEventbyId,
  updateEvent,
  deleteEvent,
  getPaginatedEvents,
} from '../controllers/eventController.js'
import type {
  CreateEventBody,
  Event,
  EventRouteParams,
  MemoryLaneRouteParams,
  PaginationQuery,
  PaginatedEventsResponse,
  ErrorResponse,
  SuccessResponse,
} from '../types/index.js'

// Router for single event operations (no memoryLaneId needed)
const eventRoutes = express.Router()

eventRoutes.get(
  '/:eventId',
  getEventbyId as RequestHandler<EventRouteParams, Event | ErrorResponse>
)
eventRoutes.put(
  '/:eventId',
  updateEvent as RequestHandler<
    EventRouteParams,
    Event | ErrorResponse,
    CreateEventBody
  >
)
eventRoutes.delete(
  '/:eventId',
  deleteEvent as RequestHandler<
    EventRouteParams,
    SuccessResponse | ErrorResponse
  >
)
eventRoutes.post(
  '/',
  createEvent as RequestHandler<{}, Event | ErrorResponse, CreateEventBody>
)

// Router for memory lane scoped operations
const memoryLaneEventsRoutes = express.Router({ mergeParams: true })

memoryLaneEventsRoutes.get(
  '/',
  getPaginatedEvents as RequestHandler<
    MemoryLaneRouteParams,
    PaginatedEventsResponse | ErrorResponse,
    {},
    PaginationQuery
  >
)

export { eventRoutes, memoryLaneEventsRoutes }
