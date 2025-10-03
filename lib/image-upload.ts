import { uploadDirectToImageKit, deleteFromImageKit, ImageKitUploadResult } from './imagekit'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadImage(file: File, folder: string = 'escape-rooms'): Promise<UploadResult> {
  try {
    const result = await uploadDirectToImageKit(file, {
      folder,
      tags: ['escape-room', 'listing'],
      useUniqueFileName: true
    })

    return {
      success: result.success,
      url: result.url,
      error: result.error
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function uploadMultipleImages(files: File[], folder: string = 'escape-rooms'): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder))
    const results = await Promise.all(uploadPromises)

    const failedUploads = results.filter(result => !result.success)
    if (failedUploads.length > 0) {
      return { 
        success: false, 
        error: `Failed to upload ${failedUploads.length} image(s). ${failedUploads[0].error}` 
      }
    }

    const urls = results.map(result => result.url!).filter(Boolean)
    return { success: true, urls }
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteImage(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    return await deleteFromImageKit(fileId)
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  return { valid: true }
}
