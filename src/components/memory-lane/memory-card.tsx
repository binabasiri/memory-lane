import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditMemoryDialog } from './edit-memory-dialog'
import { DeleteMemoryDialog } from './delete-memory-dialog'
import ImageStack from '../ui/image-stack'
import type { Event } from '@/types'

interface MemoryCardProps {
  event: Event
  memoryLaneId: string
}
export function MemoryCard({ event, memoryLaneId }: MemoryCardProps) {
  const navigate = useNavigate()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const isEditMode = useMatch('/memory-lane/:memoryLaneId/edit') !== null
  const eventLink = isEditMode
    ? `/event/${event.id}/edit`
    : `/event/${event.id}`
  const handleEventClick = () => {
    navigate(eventLink)
  }

  return (
    <>
      <Card
        key={event.id}
        className='w-full cursor-pointer transition-shadow hover:shadow-lg'
        onClick={handleEventClick}
      >
        <CardHeader className='flex flex-row items-center justify-between p-4'>
          {/* Card Header Content */}
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl'>
              🌵
            </div>
            <div>
              <h3 className='font-semibold capitalize'>{event.title}</h3>
              <p className='text-sm text-gray-500'>
                {new Date(event.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {isEditMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-red-600'
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className='p-4 pt-0'>
          <p className='text-gray-600'>{event.description}</p>
          {/* Images Grid */}
          {event.images?.length > 0 && (
            <ImageStack images={event.images} timestamp={event.timestamp} />
          )}
        </CardContent>
      </Card>

      <EditMemoryDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        memoryLaneId={memoryLaneId}
        event={event}
      />

      <DeleteMemoryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        memoryLaneId={memoryLaneId}
        eventId={event.id}
      />
    </>
  )
}
