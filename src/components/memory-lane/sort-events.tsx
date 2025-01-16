import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortOrder } from '@/types'

interface SortEventsProps {
  onSortChange: (order: SortOrder) => void
  currentSort: SortOrder
}

export function SortEvents({ onSortChange, currentSort }: SortEventsProps) {
  return (
    <Select value={currentSort} onValueChange={onSortChange}>
      <SelectTrigger className='w-40'>
        <SelectValue placeholder='Sort by' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='older'>Older to new</SelectItem>
        <SelectItem value='newer'>Newer to old</SelectItem>
      </SelectContent>
    </Select>
  )
}
