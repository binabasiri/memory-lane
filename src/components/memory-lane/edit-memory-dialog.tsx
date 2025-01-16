import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { MemoryForm } from './memory-form'
import { useEditEvent } from '@/hooks/use-edit-event'
import type { Event } from '@/types'
interface EditMemoryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  memoryLaneId: string
  event: Event
}
export function EditMemoryDialog({
  isOpen,
  onOpenChange,
  memoryLaneId,
  event,
}: EditMemoryDialogProps) {
  const {
    form,
    handleDateChange,
    onSubmit,
    handleUploadedFiles,
    handleDialogChange,
    isSubmitting,
    error,
  } = useEditEvent({
    memoryLaneId,
    event,
    setIsDialogOpen: onOpenChange,
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='space-y-3 px-1'>
          <DialogTitle className='text-2xl'>Edit Memory</DialogTitle>
          <DialogDescription>
            Update your memory details and images.
          </DialogDescription>
        </DialogHeader>
        <MemoryForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => handleDialogChange(false)}
          submitLabel='Update Memory'
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
