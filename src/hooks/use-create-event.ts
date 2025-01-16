import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventSchema, type CreateEventFormData } from '@/schemas'
import type { Event, UploadedFile } from '@/types'
interface UseCreateEventProps {
  memoryLaneId: string
}
async function createEvent(
  data: CreateEventFormData & { memoryLaneId: string }
): Promise<Event> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create event')
  }

  return response.json()
}

export function useCreateEvent({ memoryLaneId }: UseCreateEventProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      timestamp: new Date().toISOString(),
      images: [],
    },
  })

  const createEventMutation = useMutation({
    mutationFn: (values: CreateEventFormData) =>
      createEvent({ ...values, memoryLaneId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', memoryLaneId] })
      form.reset()
      setIsDialogOpen(false)
      toast({
        title: 'Memory Created ✅',
        description: 'Your memory has been successfully created.',
        variant: 'default',
        duration: 3000,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error ❌',
        description:
          error instanceof Error ? error.message : 'Failed to create memory',
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
    createEventMutation.mutate(values)
  }

  const handleUploadedFiles = (files: UploadedFile[]) => {
    form.setValue('images', files)
  }

  return {
    form,
    isDialogOpen,
    setIsDialogOpen,
    handleDateChange,
    onSubmit,
    handleUploadedFiles,
    isSubmitting: createEventMutation.isPending,
    error: createEventMutation.error,
  }
}
