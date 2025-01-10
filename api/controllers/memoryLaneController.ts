import { Request, Response } from 'express'
import prisma from '../config/db.js'
import { CreateMemoryLaneBody } from '../types/index.js'

export const createMemoryLane = async (
  req: Request<{ userId: string }, {}, CreateMemoryLaneBody>,
  res: Response
) => {
  const { userId } = req.params
  const { title, description } = req.body
  try {
    const memoryLane = await prisma.memoryLane.create({
      data: {
        title,
        description,
        userId: parseInt(userId),
      },
    })
    res.status(201).json(memoryLane)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getMemoryLanes = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params
  try {
    const memoryLanes = await prisma.memoryLane.findMany({
      where: { userId: parseInt(userId) },
      include: { events: true },
    })
    res.json(memoryLanes)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}
