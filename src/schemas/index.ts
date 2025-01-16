import * as z from 'zod'

// ==============================
// Auth Schemas
// ==============================
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const signupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

// ==============================
// Memory Lane Schemas
// ==============================
export const memoryLaneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Title is required'),
})

// ==============================
// Event Schemas
// ==============================
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timestamp: z.string(),
  images: z.instanceof(FileList).nullable(),
})

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timestamp: z.string().min(1, 'Date is required'),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'Image URL is required'),
        name: z.string().min(1, 'Image name is required'),
      })
    )
    .min(1, 'At least one image is required'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type SignupFormData = z.infer<typeof signupFormSchema>
export type MemoryLaneFormData = z.infer<typeof memoryLaneSchema>
export type EventFormData = z.infer<typeof eventSchema>
export type CreateEventFormData = z.infer<typeof createEventSchema>
