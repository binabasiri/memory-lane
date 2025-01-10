export interface CreateUserBody {
  name: string
  email: string
}

export interface CreateMemoryLaneBody {
  title: string
  description?: string
}

export interface CreateEventBody {
  title: string
  description: string
  timestamp: string
  images: string[]
}

export interface UpdateEventBody extends CreateEventBody {}
