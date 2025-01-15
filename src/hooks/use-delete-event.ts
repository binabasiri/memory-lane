import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UseDeleteEventProps {
  memoryLaneId: string
  eventId: string
}
async function deleteEvent(eventId: string): Promise<void> {
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete event')
  }
}

export function useDeleteEvent({ memoryLaneId, eventId }: UseDeleteEventProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', memoryLaneId] })
      toast({
        title: 'Memory Deleted ✅',
        description: 'Your memory has been successfully deleted.',
        variant: 'default',
        duration: 3000,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error ❌',
        description:
          error instanceof Error ? error.message : 'Failed to delete memory',
        duration: 3000,
      })
    },
  })

  const handleDelete = () => {
    deleteEventMutation.mutate(eventId)
  }

  return {
    handleDelete,
  }
}
