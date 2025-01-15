import { ErrorPage } from '@/components/error'
import { LoadingPage } from '@/components/loading'
import { EventList } from '@/components/memory-lane/event-list'
import { MemoryHeader } from '@/components/memory-lane/memory-header'
import type { MemoryLane } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useMatch, useParams } from 'react-router-dom'

async function fetchEvents(memoryLaneId: string): Promise<MemoryLane> {
  const response = await fetch(`/api/memory-lanes/${memoryLaneId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function MemoryLanePage() {
  const { memoryLaneId } = useParams()
  const isEditMode = useMatch('/memory-lane/:memoryLaneId/edit') !== null

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', memoryLaneId],
    queryFn: () => fetchEvents(memoryLaneId!),
    enabled: !!memoryLaneId,
  })

  if (isLoading) return <LoadingPage />

  if (error) {
    return (
      <ErrorPage
        title='Failed to load Memory Lane'
        message={
          error instanceof Error ? error.message : 'Unable to load memories'
        }
        retry={() => refetch()}
      />
    )
  }

  if (!data || !memoryLaneId) return null

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <MemoryHeader memoryLane={data} isEditMode={isEditMode} />

      <EventList memoryLaneId={memoryLaneId} isEditMode={isEditMode} />
    </div>
  )
}
