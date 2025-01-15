import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { MemoryForm } from './memory-form'
import { useCreateEvent } from '@/hooks/use-create-event'
interface CreateMemoryDialogProps {
  memoryLaneId: string
}

export function CreateMemoryDialog({ memoryLaneId }: CreateMemoryDialogProps) {
  const {
    form,
    isDialogOpen,
    setIsDialogOpen,
    handleDateChange,
    onSubmit,
    handleUploadedFiles,
    isSubmitting,
    error,
  } = useCreateEvent({ memoryLaneId })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          New memory
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='space-y-3 px-1'>
          <DialogTitle className='text-2xl'>Create New Memory</DialogTitle>
          <DialogDescription>
            Capture and preserve your special moments. Add details and images to
            create a lasting memory.
          </DialogDescription>
        </DialogHeader>
        <MemoryForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel='Create Memory'
          handleDateChange={handleDateChange}
          handleUploadedFiles={handleUploadedFiles}
          isSubmitting={isSubmitting}
        />
        {error && (
          <p className='text-sm text-red-500 mt-2'>
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
