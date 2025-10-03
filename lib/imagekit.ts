// ImageKit configuration
const IMAGEKIT_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
}

export interface ImageKitUploadResult {
  success: boolean
  url?: string
  fileId?: string
  error?: string
}

export interface ImageKitUploadOptions {
  folder?: string
  fileName?: string
  tags?: string[]
  useUniqueFileName?: boolean
  responseFields?: string[]
}

export async function uploadToImageKit(
  file: File | Buffer,
  options: ImageKitUploadOptions = {}
): Promise<ImageKitUploadResult> {
  try {
    const {
      folder = '/escape-rooms',
      fileName,
      tags = ['escape-room'],
      useUniqueFileName = true,
      responseFields = ['url', 'fileId']
    } = options

    // Convert File to Buffer if needed
    let fileBuffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
    } else {
      fileBuffer = file
    }

    // Use the API route for server-side uploads
    const formData = new FormData()
    formData.append('file', new Blob([fileBuffer]), fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}`)
    formData.append('folder', folder)
    formData.append('tags', tags.join(','))
    formData.append('useUniqueFileName', useUniqueFileName.toString())

    const response = await fetch('/api/imagekit/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()

    return {
      success: true,
      url: result.url,
      fileId: result.fileId
    }
  } catch (error) {
    console.error('Error uploading to ImageKit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export async function uploadMultipleToImageKit(
  files: File[],
  options: ImageKitUploadOptions = {}
): Promise<{ success: boolean; results?: ImageKitUploadResult[]; error?: string }> {
  try {
    const uploadPromises = files.map(file => uploadToImageKit(file, options))
    const results = await Promise.all(uploadPromises)

    const failedUploads = results.filter(result => !result.success)
    if (failedUploads.length > 0) {
      return {
        success: false,
        error: `Failed to upload ${failedUploads.length} image(s). ${failedUploads[0].error}`
      }
    }

    return {
      success: true,
      results
    }
  } catch (error) {
    console.error('Error uploading multiple files to ImageKit:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during upload'
    }
  }
}

export async function deleteFromImageKit(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/imagekit/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId })
    })

    if (!response.ok) {
      throw new Error('Delete failed')
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting from ImageKit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

export function getImageKitUrl(
  fileId: string,
  transformations?: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'jpg' | 'png' | 'webp'
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max'
    cropMode?: 'center' | 'top' | 'left' | 'bottom' | 'right' | 'left_top' | 'right_top' | 'left_bottom' | 'right_bottom'
  }
): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
  
  if (!transformations) {
    return `${baseUrl}/${fileId}`
  }

  const transformParams: string[] = []
  
  if (transformations.width) transformParams.push(`w-${transformations.width}`)
  if (transformations.height) transformParams.push(`h-${transformations.height}`)
  if (transformations.quality) transformParams.push(`q-${transformations.quality}`)
  if (transformations.format) transformParams.push(`f-${transformations.format}`)
  if (transformations.crop) transformParams.push(`c-${transformations.crop}`)
  if (transformations.cropMode) transformParams.push(`cm-${transformations.cropMode}`)

  const transformString = transformParams.join(',')
  return `${baseUrl}/tr:${transformString}/${fileId}`
}

// Client-side upload function for direct browser uploads
export async function uploadDirectToImageKit(
  file: File,
  options: ImageKitUploadOptions = {}
): Promise<ImageKitUploadResult> {
  try {
    // Use our API route for upload instead of direct ImageKit upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', options.folder || '/escape-rooms')
    formData.append('tags', (options.tags || ['escape-room']).join(','))
    formData.append('useUniqueFileName', 'true')

    // Upload through our API route
    const uploadResponse = await fetch('/api/imagekit/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      console.error('Upload failed:', errorData)
      throw new Error(errorData.error || 'Upload failed')
    }

    const result = await uploadResponse.json()

    return {
      success: true,
      url: result.url,
      fileId: result.fileId
    }
  } catch (error) {
    console.error('Error uploading to ImageKit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}
