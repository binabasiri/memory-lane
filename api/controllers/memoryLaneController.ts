import type { Request, Response } from 'express'
import prisma from '../config/db.js'
import type {
  CreateMemoryLaneBody,
  MemoryLane,
  MemoryLaneRouteParams,
  ErrorResponse,
  UpdateMemoryLaneBody,
} from '../types/index.js'
import {
  createMemoryLaneSchema,
  updateMemoryLaneSchema,
} from '../validations/schemas.js'
import { z } from 'zod'

export const createMemoryLane = async (
  req: Request<{}, MemoryLane | ErrorResponse, CreateMemoryLaneBody>,
  res: Response<MemoryLane | ErrorResponse>
) => {
  try {
    const validatedData = createMemoryLaneSchema.parse(req.body)
    const memoryLane = await prisma.memoryLane.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        userId: validatedData.userId,
      },
    })
    res.status(201).json(memoryLane)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.message })
    }
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getMemoryLane = async (
  req: Request<MemoryLaneRouteParams>,
  res: Response<MemoryLane | ErrorResponse>
) => {
  try {
    const memoryLane = await prisma.memoryLane.findUnique({
      where: { id: req.params.memoryLaneId! },
    })
    if (!memoryLane) {
      res.status(404).json({ error: 'Memory lane not found' })
      return
    }
    res.status(200).json(memoryLane)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const updateMemoryLane = async (
  req: Request<
    MemoryLaneRouteParams,
    MemoryLane | ErrorResponse,
    UpdateMemoryLaneBody
  >,
  res: Response<MemoryLane | ErrorResponse>
) => {
  try {
    const memoryLane = await prisma.memoryLane.update({
      where: { id: req.params.memoryLaneId! },
      data: {
        description: req.body.description,
      },
    })
    res.status(200).json(memoryLane)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}
