import type { Request, Response } from 'express'
import prisma from '../config/db.js'
import type {
  CreateEventBody,
  Event,
  EventRouteParams,
  MemoryLaneRouteParams,
  PaginatedEventsResponse,
  PaginationQuery,
  ErrorResponse,
  SuccessResponse,
} from '../types/index.js'
import {
  createEventSchema,
  updateEventSchema,
  paginationSchema,
} from '../validations/schemas.js'
import { z } from 'zod'

export const createEvent = async (
  req: Request<{}, Event | ErrorResponse, CreateEventBody>,
  res: Response<Event | ErrorResponse>
) => {
  try {
    // Validate input
    const validatedData = createEventSchema.parse(req.body)

    const { title, description, timestamp, images, memoryLaneId } =
      validatedData

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error:
          'At least one image is required. Please attach an image to continue.',
      })
    }

    const isValidImageData = images.every((img) => img.url && img.name)
    if (!isValidImageData) {
      return res.status(400).json({
        error:
          'Invalid image data provided. Each image must have a URL and name.',
      })
    }

    const event = await prisma.$transaction(async (tx) => {
      const memoryLane = await tx.memoryLane.findUnique({
        where: { id: memoryLaneId },
      })

      if (!memoryLane) {
        throw new Error('Memory Lane not found')
      }

      return tx.event.create({
        data: {
          title,
          description,
          timestamp: new Date(timestamp),
          memoryLane: {
            connect: { id: memoryLaneId },
          },
          images: {
            create: images.map((image) => ({
              url: image.url,
              name: image.name,
            })),
          },
        },
        include: {
          images: true,
        },
      })
    })

    res.status(201).json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.message })
    }
    console.error('Error creating event:', error)
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getEvents = async (
  req: Request<{ memoryLaneId: string }>,
  res: Response
) => {
  const { memoryLaneId } = req.params
  try {
    const events = await prisma.event.findMany({
      where: { memoryLaneId: memoryLaneId },
      include: {
        images: true,
      },
      orderBy: { timestamp: 'desc' },
    })
    res.json(events)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getEventbyId = async (
  req: Request<EventRouteParams>,
  res: Response<Event | ErrorResponse>
) => {
  const { eventId } = req.params
  try {
    const events = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        images: true,
      },
    })
    res.status(200).json(events!)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const updateEvent = async (
  req: Request<EventRouteParams, Event | ErrorResponse, CreateEventBody>,
  res: Response<Event | ErrorResponse>
) => {
  const { eventId } = req.params
  const { title, description, timestamp, images } = req.body

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({
      error:
        'At least one image is required. Please attach an image to continue.',
    })
  }

  const isValidImageData = images.every((img) => img.url && img.name)
  if (!isValidImageData) {
    return res.status(400).json({
      error:
        'Invalid image data provided. Each image must have a URL and name.',
    })
  }

  try {
    const event = await prisma.$transaction(async (tx) => {
      const currentEvent = await tx.event.findUnique({
        where: { id: eventId },
        include: { images: true },
      })

      if (!currentEvent) {
        throw new Error('Event not found')
      }

      // Get URLs of images that should be kept
      const updatedImageUrls = new Set(images.map((img) => img.url))

      const imagesToDelete = currentEvent.images.filter(
        (img) => !updatedImageUrls.has(img.url)
      )

      if (imagesToDelete.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: {
              in: imagesToDelete.map((img) => img.id),
            },
          },
        })
      }

      // Update event and remaining/new images
      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          title,
          description,
          timestamp: new Date(timestamp),
          images: {
            upsert: images.map((image) => ({
              where: {
                eventId_url: {
                  eventId: eventId,
                  url: image.url,
                },
              },
              create: {
                url: image.url,
                name: image.name,
              },
              update: {
                name: image.name,
              },
            })),
          },
        },
        include: {
          images: true,
        },
      })

      // Verify that the event still has at least one image after update
      if (updatedEvent.images.length === 0) {
        throw new Error('Event must have at least one image')
      }

      return updatedEvent
    })

    res.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(400).json({ error: (error as Error).message })
  }
}

export const deleteEvent = async (
  req: Request<EventRouteParams>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const { eventId } = req.params
  try {
    await prisma.event.delete({
      where: { id: eventId },
    })
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getPaginatedEvents = async (
  req: Request<
    MemoryLaneRouteParams,
    PaginatedEventsResponse | ErrorResponse,
    {},
    PaginationQuery
  >,
  res: Response<PaginatedEventsResponse | ErrorResponse>
) => {
  try {
    const validatedQuery = paginationSchema.parse(req.query)
    const page = validatedQuery.page ?? 1
    const limit = validatedQuery.limit ?? 10
    const sort = validatedQuery.sort ?? 'older'
    const skip = (page - 1) * limit

    const total = await prisma.event.count({
      where: { memoryLaneId: req.params.memoryLaneId },
    })

    const events = await prisma.event.findMany({
      where: { memoryLaneId: req.params.memoryLaneId },
      include: {
        images: true,
      },
      orderBy: [
        {
          timestamp: sort === 'older' ? 'asc' : 'desc',
        },
        { createdAt: sort === 'older' ? 'asc' : 'desc' },
      ],
      skip,
      take: limit,
    })

    res.json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.message })
    }
    res.status(400).json({ error: (error as Error).message })
  }
}
