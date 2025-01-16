import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventSchema, type CreateEventFormData } from '@/schemas'
import type { Event, UploadedFile } from '@/types'
interface UseEditEventProps {
  memoryLaneId: string
  event: Event
  setIsDialogOpen: (open: boolean) => void
}
async function updateEvent(data: {
  eventId: string
  title: string
  description: string
  timestamp: string
  images: UploadedFile[]
}): Promise<Event> {
  const response = await fetch(`/api/events/${data.eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update event')
  }

  return response.json()
}

export function useEditEvent({
  memoryLaneId,
  event,
  setIsDialogOpen,
}: UseEditEventProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      timestamp: event.timestamp,
      images: event.images.map((img) => ({
        url: img.url,
        name: img.name,
      })),
    },
  })

  const updateEventMutation = useMutation({
    mutationFn: (values: CreateEventFormData) =>
      updateEvent({
        eventId: event.id,
        ...values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', memoryLaneId] })
      form.reset()
      setIsDialogOpen(false)
      toast({
        title: 'Memory Updated ✅',
        description: 'Your memory has been successfully updated.',
        variant: 'default',
        duration: 3000,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error ❌',
        description:
          error instanceof Error ? error.message : 'Failed to update memory',
        duration: 3000,
      })
    },
  })

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      form.setValue('timestamp', date.toISOString())
    }
  }

  const onSubmit = (values: CreateEventFormData) => {
    const hasChanges =
      values.title !== event.title ||
      values.description !== event.description ||
      values.timestamp !== event.timestamp ||
      values.images.length !== event.images.length ||
      values.images.some((file, index) => file.url !== event.images[index]?.url)

    if (!hasChanges) {
      toast({
        title: 'No Changes ℹ️',
        description: 'No changes were made to the memory.',
        duration: 3000,
      })
      return
    }

    updateEventMutation.mutate(values)
  }

  const handleUploadedFiles = (files: UploadedFile[]) => {
    form.setValue('images', files)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    setIsDialogOpen(open)
  }

  return {
    form,
    handleDateChange,
    onSubmit,
    handleUploadedFiles,
    handleDialogChange,
    isSubmitting: updateEventMutation.isPending,
    error: updateEventMutation.error,
  }
}
