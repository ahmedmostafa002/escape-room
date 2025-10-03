import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath is required' },
        { status: 400 }
      )
    }

    // Generate a new signed URL
    const signedUrl = imagekit.url({
      path: filePath,
      signed: true,
      expireSeconds: 86400 // 24 hours
    })

    return NextResponse.json({
      success: true,
      url: signedUrl,
      filePath
    })
  } catch (error) {
    console.error('Error refreshing URL:', error)
    return NextResponse.json(
      { error: 'Failed to refresh URL' },
      { status: 500 }
    )
  }
}
