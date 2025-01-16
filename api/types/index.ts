// =============================================================================
// Base Response Types
// =============================================================================
export interface ErrorResponse {
  error: string
}

export interface SuccessResponse {
  message: string
}

// =============================================================================
// User Types
// =============================================================================
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  memoryLane?: MemoryLane | null
}

export interface CreateUserBody {
  name: string
  email: string
}

export interface LoginBody {
  email: string
}

// =============================================================================
// Memory Lane Types
// =============================================================================
export interface MemoryLane {
  id: string
  title: string
  description?: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  events?: Event[] | null
}

export interface CreateMemoryLaneBody {
  title: string
  description?: string | null
  userId: string
}

export interface UpdateMemoryLaneBody {
  description: string
}

// =============================================================================
// Event Types
// =============================================================================
export interface Event {
  id: string
  title: string
  description: string
  timestamp: Date
  memoryLaneId: string
  images: Image[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventBody {
  memoryLaneId: string
  title: string
  description: string
  timestamp: string
  images: ImageData[]
}

// =============================================================================
// Image Types
// =============================================================================
export interface Image {
  id: string
  url: string
  name: string
  eventId: string
  createdAt: Date
  updatedAt: Date
}

export interface ImageData {
  url: string
  name: string
}

// =============================================================================
// Route & Query Parameters
// =============================================================================
export interface EventRouteParams {
  eventId: string
}

export interface MemoryLaneRouteParams {
  memoryLaneId: string
}

export interface PaginationQuery {
  page?: string
  limit?: string
  sort?: 'older' | 'newer'
}

// =============================================================================
// Paginated Response Types
// =============================================================================
export interface PaginatedEventsResponse {
  events: Event[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}
