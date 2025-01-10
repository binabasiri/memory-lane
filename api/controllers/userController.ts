import { Request, Response } from 'express'
import prisma from '../config/db.js'
import { CreateUserBody } from '../types/index.js'

export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
) => {
  const { name, email } = req.body
  try {
    const user = await prisma.user.create({
      data: { name, email },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}
