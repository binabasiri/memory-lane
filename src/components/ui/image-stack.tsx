import { cn } from '@/lib/utils'
import LazyImage from './lazy-image'
import type { EventImage } from '@/types'
interface ImageStackProps {
  images: EventImage[]
  timestamp: string
}

function ImageStack({ images, timestamp }: ImageStackProps) {
  return (
    <div className='mt-4 relative h-[250px] w-full flex items-center justify-center group'>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            'absolute w-[180px] bg-gray-100 p-3 rounded-sm shadow-md transition-all duration-300',
            'group-hover:translate-y-[-20px]',
            index === 0 && 'rotate-[-3deg] z-[3]',
            index === 1 && 'rotate-[2deg] z-[2] translate-x-8 translate-y-2',
            index === 2 && 'rotate-[-2deg] z-[1] -translate-x-8 translate-y-5',
            index >= 3 && 'rotate-[4deg] translate-x-12 translate-y-7'
          )}
        >
          <div className='aspect-square w-full overflow-hidden'>
            <LazyImage
              src={image.url}
              alt={`Image ${index + 1} for ${image.name}`}
              priority={index === 0}
            />
          </div>
          <div className='mt-2 text-center text-sm text-gray-600 font-medium'>
            {new Date(timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageStack
