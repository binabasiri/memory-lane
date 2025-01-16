// ==============================
// User Types
// ==============================
export interface User {
  id: string
  name: string
  email: string
  memoryLane: MemoryLane | null
  createdAt: string
  updatedAt: string
}

// ==============================
// Memory Lane Types
// ==============================
export interface MemoryLane {
  id: string
  title: string
  description: string | null
  userId: string
  events?: Event[]
}

// ==============================
// Event Types
// ==============================
export interface Event {
  id: string
  title: string
  description: string
  timestamp: string
  memoryLaneId: string
  images: EventImage[]
}

export interface EventImage {
  id: string
  url: string
  name: string
}

// ==============================
// Form Types
// ==============================
export interface NewMemoryFormData {
  title: string
  description: string
  timestamp: string
  images: FileList | null
}

// ==============================
// Upload Types
// ==============================
export interface UploadedFile {
  url: string
  name: string
}

export type Preview = {
  file: File
  url: string
}

// ==============================
// API Response Types
// ==============================
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export interface PaginatedEventsResponse {
  events: Event[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

// ==============================
// Utility Types
// ==============================
export type SortOrder = 'older' | 'newer'
