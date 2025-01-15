import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import { EditMemoryLaneDialog } from './edit-memory-lane-dialog'
import { useState } from 'react'
import { MemoryLane } from '@/types'
interface MemoryHeaderProps {
  memoryLane: MemoryLane
  isEditMode: boolean
}
export function MemoryHeader({
  memoryLane: initialMemoryLane,
  isEditMode,
}: MemoryHeaderProps) {
  const [memoryLane, setMemoryLane] = useState(initialMemoryLane)
  const { toast } = useToast()

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/memory-lane/${memoryLane.id}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied! ✅',
        description: 'Memory lane link has been copied to your clipboard',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Failed to copy ❌',
        description: 'Could not copy the link to clipboard',
        duration: 3000,
      })
    }
  }

  return (
    <div className='flex justify-between items-start mb-8'>
      <div>
        <h1 className='text-2xl font-semibold mb-4 capitalize'>
          {memoryLane.title}
        </h1>
        <p className='text-gray-600 text-sm'>{memoryLane.description}</p>
      </div>
      <div className='flex gap-2'>
        {isEditMode && (
          <EditMemoryLaneDialog
            memoryLane={memoryLane}
            onUpdate={setMemoryLane}
          />
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={handleShare}
          title='Share memory lane'
        >
          <Share2 className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
