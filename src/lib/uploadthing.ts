import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
  type GenerateTypedHelpersOptions,
} from '@uploadthing/react'

import type { OurFileRouter } from 'api/routes/uploadRoutes'

const initOpts = {
  url: 'http://localhost:4001',
} satisfies GenerateTypedHelpersOptions

export const UploadButton = generateUploadButton<OurFileRouter>(initOpts)
export const UploadDropzone = generateUploadDropzone<OurFileRouter>(initOpts)

export const { useUploadThing } = generateReactHelpers<OurFileRouter>(initOpts)
