import { useParams, useNavigate, useMatch } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/loading'
import { ErrorPage } from '@/components/error'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

async function fetchEvent(eventId: string): Promise<Event> {
  const response = await fetch(`/api/events/${eventId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch event')
  }
  return response.json()
}

export default function EventPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const viewMode = useMatch('/event/:eventId/edit') !== null ? '/edit' : ''
  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId!),
    enabled: !!eventId,
  })

  const goToNextImage = () => {
    if (event?.images && currentImageIndex < event.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }
  }

  const goToPreviousImage = () => {
    if (event?.images && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
      goToPreviousImage()
    } else if (
      e.key === 'ArrowRight' &&
      event?.images &&
      currentImageIndex < event.images.length - 1
    ) {
      goToNextImage()
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage
        title='Failed to load event'
        message={
          error instanceof Error
            ? error.message
            : 'Unable to load event details'
        }
        retry={() => refetch()}
      />
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className='container max-w-4xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='mb-8'>
        <Button
          variant='ghost'
          className='mb-6 -ml-4 text-muted-foreground'
          onClick={() =>
            navigate(`/memory-lane/${event.memoryLaneId}${viewMode}`)
          }
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Memory Lane
        </Button>

        <div className='space-y-2'>
          <p className='text-3xl font-bold capitalize'>{event.title}</p>
          <div className='flex items-center text-muted-foreground'>
            <Calendar className='mr-2 h-4 w-4' />
            <time>
              {new Date(event.timestamp).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='prose max-w-none  mb-8'>
        <p className='text-lg capitalize pb-1'>event description</p>
        <p className='text-lg text-muted-foreground pl-2'>
          {event.description}
        </p>
      </div>

      {/* Images */}
      {event.images.length > 0 && (
        <div className='space-y-6'>
          <h2 className='text-xl font-semibold'>Photos</h2>

          {/* Main Image */}
          <div
            className='relative aspect-[3/2] w-full rounded-lg overflow-hidden bg-gray-100'
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <img
              src={event.images[currentImageIndex].url}
              alt={event.images[currentImageIndex].name}
              className='w-full h-full object-contain bg-black/5'
            />

            {/* Navigation Buttons */}
            {event.images.length > 1 && (
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn(
                    'absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm',
                    currentImageIndex === 0 &&
                      'opacity-50 cursor-not-allowed hover:bg-white/80'
                  )}
                  onClick={goToPreviousImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn(
                    'absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm',
                    currentImageIndex === event.images.length - 1 &&
                      'opacity-50 cursor-not-allowed hover:bg-white/80'
                  )}
                  onClick={goToNextImage}
                  disabled={currentImageIndex === event.images.length - 1}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {event.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-2 snap-x'>
              {event.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-20 aspect-square rounded-md overflow-hidden transition-all duration-200',
                    'hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary',
                    currentImageIndex === index && 'ring-2 ring-primary'
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
