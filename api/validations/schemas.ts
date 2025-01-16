import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Memory Lane validation schemas
export const createMemoryLaneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  userId: z.string().cuid('Invalid user ID'),
})

export const updateMemoryLaneSchema = z.object({
  description: z.string().nullable().optional(),
})

// Event validation schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timestamp: z.string().datetime('Invalid date format'),
  memoryLaneId: z.string().cuid('Invalid memory lane ID'),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        name: z.string().min(1, 'Image name is required'),
      })
    )
    .min(1, 'At least one image is required'),
})

export const updateEventSchema = createEventSchema.omit({ memoryLaneId: true })

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(['older', 'newer']).optional(),
})
