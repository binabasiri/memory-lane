import type { Event } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { MemoryCard } from './memory-card'
import { SortEvents } from './sort-events'
import { CreateMemoryDialog } from './create-memory-dialog'
import type { PaginatedEventsResponse } from '@/types'

interface EventListProps {
  memoryLaneId: string
  isEditMode: boolean
}

async function fetchEvents({
  memoryLaneId,
  page,
  sort,
}: {
  memoryLaneId: string
  page: number
  sort: 'older' | 'newer'
}): Promise<PaginatedEventsResponse> {
  const response = await fetch(
    `/api/memory-lanes/${memoryLaneId}/events?page=${page}&limit=5&sort=${sort}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }
  return response.json()
}

export function EventList({ memoryLaneId, isEditMode }: EventListProps) {
  const { ref: loadMoreRef, inView } = useInView()
  const [sortOrder, setSortOrder] = useState<'older' | 'newer'>('older')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['events', memoryLaneId, sortOrder],
    queryFn: ({ pageParam }) =>
      fetchEvents({ memoryLaneId, page: pageParam, sort: sortOrder }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  })

  // Load more when the last element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle sort order change
  const handleSortChange = (newOrder: 'older' | 'newer') => {
    setSortOrder(newOrder)
    refetch()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        {isEditMode && <CreateMemoryDialog memoryLaneId={memoryLaneId} />}

        <SortEvents onSortChange={handleSortChange} currentSort={sortOrder} />
      </div>

      <div className='space-y-4'>
        {data?.pages
          .flatMap((page) => page.events)
          .map((event: Event) => (
            <MemoryCard
              key={event.id}
              event={event}
              memoryLaneId={memoryLaneId}
            />
          ))}

        <div ref={loadMoreRef} className='py-4 text-center'>
          {isFetchingNextPage ? (
            <p className='text-muted-foreground'>Loading more...</p>
          ) : hasNextPage ? (
            <p className='text-muted-foreground'>Scroll to load more</p>
          ) : (
            <p className='text-muted-foreground'>No more memories to load</p>
          )}
        </div>
      </div>
    </>
  )
}
