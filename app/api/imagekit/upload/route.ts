import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || '/escape-rooms'
    const tags = (formData.get('tags') as string)?.split(',') || ['escape-room']
    const useUniqueFileName = formData.get('useUniqueFileName') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder,
      tags,
      useUniqueFileName: true,
      isPrivateFile: false, // Make sure files are public
      overwriteFile: false
    })

    console.log('Upload successful:', uploadResult)

    // Generate a public URL (no signature needed if folder is public)
    const publicUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${uploadResult.filePath}`

    // Also generate a signed URL as backup
    const signedUrl = imagekit.url({
      path: uploadResult.filePath,
      signed: true,
      expireSeconds: 86400 // 24 hours
    })

    return NextResponse.json({
      success: true,
      url: publicUrl, // Use public URL as primary
      signedUrl: signedUrl, // Keep signed URL as backup
      fileId: uploadResult.fileId,
      originalUrl: uploadResult.url
    })
  } catch (error) {
    console.error('Error uploading to ImageKit:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Upload failed'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
