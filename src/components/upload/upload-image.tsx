import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import type { Preview } from '@/types'
import { useDropzone } from '@uploadthing/react'
import { Loader2, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client'

const MAX_IMAGES = 4

export function UploadImage({
  value = [],
  onChange,
}: {
  value?: { url: string; name: string }[]
  onChange?: (files: { url: string; name: string }[]) => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<Preview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const totalImages = value.length + previews.length
  const remainingSlots = MAX_IMAGES - totalImages

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = MAX_IMAGES - (value.length + previews.length)

      if (remainingSlots <= 0) {
        toast({
          title: 'Upload Limit Reached ❌',
          description: 'You can only upload up to 4 images.',
          duration: 3000,
        })
        return
      }

      const filesToAdd = acceptedFiles.slice(0, remainingSlots)

      const newPreviews = filesToAdd.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setPreviews((prev) => [...prev, ...newPreviews])
      setFiles(filesToAdd)

      if (acceptedFiles.length > remainingSlots) {
        toast({
          title: 'Some files were not added ❌',
          description: `Only ${remainingSlots} image${
            remainingSlots !== 1 ? 's' : ''
          } can be added. Maximum limit is 4 images.`,
          duration: 3000,
        })
      }
    },
    [value.length, previews.length, toast]
  )

  const deleteFile = (indexToDelete: number) => {
    setFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToDelete)
    )
    URL.revokeObjectURL(previews[indexToDelete].url)
    setPreviews((currentPreviews) =>
      currentPreviews.filter((_, index) => index !== indexToDelete)
    )
  }

  const deleteUploadedFile = (indexToDelete: number) => {
    if (onChange) {
      onChange(value.filter((_, index) => index !== indexToDelete))
    }
  }

  const { startUpload, routeConfig } = useUploadThing('image', {
    onClientUploadComplete: (res) => {
      setIsUploading(false)
      toast({
        title: 'Upload Complete ✅',
        description: 'Your files have been uploaded successfully.',
        duration: 3000,
      })
      const newUploadedFiles = res.map((file) => ({
        url: file.url,
        name: file.name || 'Uploaded file',
      }))
      if (onChange) {
        onChange([...value, ...newUploadedFiles])
      }
      setFiles([])
      setPreviews([])
    },
    onUploadError: (error) => {
      setIsUploading(false)
      toast({
        title: 'Upload Error ❌',
        description:
          error.message || 'Failed to upload files. Please try again.',
        duration: 3000,
      })
    },
    onUploadBegin: () => {
      setIsUploading(true)
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    maxFiles: remainingSlots,
    disabled: isUploading,
  })

  return (
    <div className='w-full max-w-2xl mx-auto space-y-8'>
      {/* Upload Section */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-medium'>Upload Images</h3>
            <p className='text-xs text-muted-foreground'>
              Add up to {MAX_IMAGES} images to your memory
            </p>
          </div>
          <span className='text-sm text-muted-foreground'>
            {value.length + previews.length} of {MAX_IMAGES} used
          </span>
        </div>

        {remainingSlots > 0 ? (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out',
              'hover:border-primary/50 hover:bg-secondary/50',
              isDragActive
                ? 'border-primary bg-secondary scale-[0.99]'
                : 'border-muted',
              isUploading && 'opacity-50 cursor-not-allowed',
              'group cursor-pointer'
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />
            <div className='flex flex-col items-center justify-center gap-2'>
              <div
                className={cn(
                  'p-4 rounded-full bg-secondary transition-all duration-200',
                  'group-hover:bg-secondary/70',
                  isDragActive && 'bg-primary/10'
                )}
              >
                {isUploading ? (
                  <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                ) : (
                  <Upload
                    className={cn(
                      'h-6 w-6 text-muted-foreground transition-colors duration-200',
                      'group-hover:text-foreground',
                      isDragActive && 'text-primary'
                    )}
                  />
                )}
              </div>
              {isDragActive ? (
                <div className='space-y-1 text-center'>
                  <p className='text-sm font-medium text-primary'>
                    Drop your images here
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Files will be uploaded immediately
                  </p>
                </div>
              ) : (
                <div className='space-y-1 text-center'>
                  {isUploading ? (
                    <p className='text-sm font-medium'>Uploading...</p>
                  ) : (
                    <p className='text-sm font-medium'>
                      {value.length > 0
                        ? 'Add more images'
                        : 'Upload your images'}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {isUploading
                      ? 'Please wait while your files are being uploaded'
                      : `Drag & drop or click to select • ${remainingSlots} slot${
                          remainingSlots !== 1 ? 's' : ''
                        } remaining`}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='rounded-xl bg-secondary/50 p-4 text-center'>
            <p className='text-sm text-muted-foreground'>
              Maximum number of images (4) reached
            </p>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        {/* Preview Images Section */}
        {previews.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Selected Images</h3>
              <span className='text-xs text-muted-foreground'>
                {previews.length} ready to upload
              </span>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {previews.map((preview, index) => (
                <div
                  key={`preview-${index}`}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-xl border bg-background shadow-sm transition-all duration-200 hover:shadow-md',
                    isUploading && 'opacity-50'
                  )}
                >
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
                  {!isUploading && (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(index)
                      }}
                      className='absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-red-500 hover:text-white group-hover:opacity-100'
                      aria-label='Delete image'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                  <div className='absolute bottom-0 left-0 right-0 p-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                    <p className='truncate font-medium'>{preview.file.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {files.length > 0 && (
              <Button
                className='w-full gap-2'
                type='button'
                onClick={() => startUpload(files)}
                size='lg'
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Upload className='h-4 w-4' />
                )}
                {isUploading
                  ? 'Uploading...'
                  : `Upload ${files.length} image${
                      files.length !== 1 ? 's' : ''
                    }`}
              </Button>
            )}
          </div>
        )}

        {/* Uploaded Images Section */}
        {value.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Uploaded Images</h3>
              <span className='text-xs text-muted-foreground'>
                {value.length} image
                {value.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {value.map((file, index) => (
                <div
                  key={`uploaded-${index}`}
                  className='group relative aspect-square overflow-hidden rounded-xl border bg-background shadow-sm transition-all duration-200 hover:shadow-md'
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
                  {!isUploading && (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteUploadedFile(index)
                      }}
                      className='absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-red-500 hover:text-white group-hover:opacity-100'
                      aria-label='Delete image'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                  <div className='absolute bottom-0 left-0 right-0 p-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                    <p className='truncate font-medium'>{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
