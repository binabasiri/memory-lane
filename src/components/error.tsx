import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

interface ErrorPageProps {
  title?: string
  message?: string
  retry?: () => void
}
export const ErrorPage = ({
  title = 'Something went wrong',
  message = 'An error occurred while processing your request.',
  retry,
}: ErrorPageProps) => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='text-center space-y-6'>
        <div className='flex justify-center'>
          <XCircle className='h-16 w-16 text-destructive' />
        </div>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
          <p className='text-muted-foreground'>{message}</p>
        </div>
        {retry && (
          <Button onClick={retry} variant='outline' className='mt-4'>
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
