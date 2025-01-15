import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DialogFooter } from '@/components/ui/dialog'
import { UploadImage } from '@/components/upload/upload-image'
import { cn } from '@/lib/utils'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateEventFormData } from '@/schemas'
import type { UploadedFile } from '@/types'

interface MemoryFormProps {
  form: UseFormReturn<CreateEventFormData>
  onSubmit: (values: CreateEventFormData) => void
  onCancel: () => void
  submitLabel: string
  handleDateChange: (date: Date | undefined) => void
  handleUploadedFiles: (files: UploadedFile[]) => void
  isSubmitting: boolean
}

export function MemoryForm({
  form,
  onSubmit,
  onCancel,
  submitLabel,
  handleDateChange,
  isSubmitting,
}: MemoryFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pt-4'>
        <div className='grid gap-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Give your memory a title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe what makes this memory special...'
                    className='min-h-[120px] resize-none lg:min-h-[150px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='timestamp'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(new Date(field.value), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className='flex gap-3 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='flex-1 sm:flex-none'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='flex-1 sm:flex-none'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
