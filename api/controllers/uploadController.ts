import { createUploadthing, type FileRouter } from 'uploadthing/server'

const f = createUploadthing()

export const uploadRouter = {
  image: f(
    {
      image: { maxFileSize: '32MB', maxFileCount: 4 },
    },
    { awaitServerData: true }
  )
    .onUploadError(({ error, fileKey }) => {
      console.log('upload error', { message: error.message, fileKey })
      throw error
    })
    .onUploadComplete(async ({ file }) => {
      console.log('Upload complete:', file)
      return {
        message: 'Media uploaded successfully',
        url: file.url,
        name: file.name,
      }
    }),
} satisfies FileRouter
