import { Request, Response } from 'express'
import prisma from '../config/db.js'
import { CreateEventBody, UpdateEventBody } from '../types/index.js'

export const createEvent = async (
  req: Request<{ memoryLaneId: string }, {}, CreateEventBody>,
  res: Response
) => {
  const { memoryLaneId } = req.params
  const { title, description, timestamp, images } = req.body

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        timestamp: new Date(timestamp),
        memoryLaneId: parseInt(memoryLaneId),
        images: {
          create: images.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    })
    res.status(201).json(event)
  } catch (error) {
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
      where: { memoryLaneId: parseInt(memoryLaneId) },
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

export const updateEvent = async (
  req: Request<{ id: string }, {}, UpdateEventBody>,
  res: Response
) => {
  const { id } = req.params
  const { title, description, timestamp, images } = req.body

  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        timestamp: new Date(timestamp),
        images: {
          upsert: images.map((url) => ({
            where: {
              eventId_url: {
                eventId: parseInt(id),
                url,
              },
            },
            create: { url },
            update: {},
          })),
        },
      },
      include: {
        images: true,
      },
    })
    res.json(event)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const deleteEvent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params
  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    })
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}
