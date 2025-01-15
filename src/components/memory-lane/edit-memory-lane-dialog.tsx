import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../../hooks/use-toast'
import { memoryLaneSchema, type MemoryLaneFormData } from '@/schemas'
import { MemoryLane } from '@/types'

interface EditMemoryLaneDialogProps {
  memoryLane: MemoryLane
  onUpdate: (updatedMemoryLane: MemoryLane) => void
}
export function EditMemoryLaneDialog({
  memoryLane,
  onUpdate,
}: EditMemoryLaneDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState(memoryLane.description || '')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate the form data
      const formData: MemoryLaneFormData = {
        title: memoryLane.title,
        description,
      }
      memoryLaneSchema.parse(formData)

      const response = await fetch(`/api/memory-lanes/${memoryLane.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) throw new Error('Failed to update memory lane')

      const updatedMemoryLane = await response.json()
      onUpdate(updatedMemoryLane)
      setIsOpen(false)

      toast({
        title: 'Success ✅',
        description: 'Memory lane updated successfully',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error ❌',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update memory lane',
        duration: 3000,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' title='Edit memory lane'>
          <Edit className='h-5 w-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Memory Lane</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='title' className='text-sm font-medium'>
              Title
            </label>
            <p className='capitalize' id='title'>
              {memoryLane.title}
            </p>
          </div>
          <div className='space-y-2'>
            <label htmlFor='description' className='text-sm font-medium'>
              Description
            </label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
