import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/db.js'
import type {
  CreateUserBody,
  ErrorResponse,
  LoginBody,
  User,
} from '../types/index.js'
import { createUserSchema, loginSchema } from '../validations/schemas.js'

export const createUser = async (
  req: Request<{}, User | ErrorResponse, CreateUserBody>,
  res: Response<User | ErrorResponse>
) => {
  try {
    const validatedData = createUserSchema.parse(req.body)
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { memoryLane: true },
    })

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
      return
    }

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
        },
      })

      await tx.memoryLane.create({
        data: {
          title: `${validatedData.name}'s Memory Lane`,
          description: 'A collection of my memories',
          userId: newUser.id,
        },
      })

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: { memoryLane: true },
      })
    })

    res.status(201).json(user!)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(400).json({ error: (error as Error).message })
  }
}

export const login = async (
  req: Request<{}, User | ErrorResponse, LoginBody>,
  res: Response<User | ErrorResponse>
) => {
  try {
    const validatedData = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { memoryLane: true },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(400).json({ error: (error as Error).message })
  }
}
