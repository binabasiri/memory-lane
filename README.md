# Memory Lane

A web application that allows users to create and share their memory lanes with friends. Users can create events with at least one image, descriptions, and timestamps to create a timeline of memories.

## Presentation

- You can see the quick overview of the app [here](https://www.loom.com/share/a58b2ecab13b426ca792f3420689d35c?sid=32d89168-085b-4341-9154-cf2a2ce0da11)

## Features

- Create and manage memory lanes
- Add events with multiple images (atleast 1 image and up to 4 images per event)
- Timeline and event view
- Image upload support
- Pagination and sorting of events

## Tech Stack

- Frontend: Vite + React + TypeScript + Tanstack Query + React Router
- Backend: Express.js + TypeScript
- Database: Prisma
- File Storage: Uploadthing
- Styling: TailwindCSS
- Components: Shadcn/UI

## API Documentation

### Base URL

http://localhost:4001/api

### Endpoints

#### Users

- `POST /users/signup` - Create new user
- `POST /users/login` - User login

#### Memory Lanes

- `POST /memory-lanes` - Create memory lane
- `GET /memory-lanes/:memoryLaneId` - Get memory lane
- `PUT /memory-lanes/:memoryLaneId` - Update memory lane

#### Events

- `POST /events` - Create event
- `GET /events/:eventId` - Get event
- `PUT /events/:eventId` - Update event
- `DELETE /events/:eventId` - Delete event
- `GET /memory-lanes/:memoryLaneId/events` - Get paginated events

#### File Upload

- `POST /uploadthing` - Upload images (max 4MB per file, 4 files max)

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the API server:

   ```bash
   npm run serve:api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:

UPLOADTHING_TOKEN="your-uploadthing-token"

## Data Models

### User

- id: string
- name: string
- email: string
- memoryLane: MemoryLane (one-to-one relationship)

### Memory Lane

- id: string
- title: string
- description: string (optional)
- userId: string (one-to-one relationship)
- events: Event[] (one-to-many relationship)

### Event

- id: string
- title: string
- description: string
- timestamp: Date ISO String
- memoryLaneId: string
- images: Image[] (one-to-many relationship)

### Image

- id: string
- url: string
- name: string
- eventId: string

## Implementation Details

- Uses TypeScript for type safety across both frontend and backend
- Implements Zod schemas for request validation
- Prisma transactions for data integrity
- Pagination support for event listings
- Image upload handling with size and count restrictions

## Future Improvements

- Add proper authentication, authorization, and user profile view
- Implement sharing user realtions and tag friends
- Add search functionality
- Implement caching for popular memory lanes
- Data analytics
- Testing
