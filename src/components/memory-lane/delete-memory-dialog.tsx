import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteEvent } from '@/hooks/use-delete-event'
interface DeleteMemoryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  memoryLaneId: string
  eventId: string
}

export function DeleteMemoryDialog({
  isOpen,
  onOpenChange,
  memoryLaneId,
  eventId,
}: DeleteMemoryDialogProps) {
  const { handleDelete } = useDeleteEvent({
    memoryLaneId,
    eventId,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Memory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this memory? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
