import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath parameter is required' },
        { status: 400 }
      )
    }

    // Generate different types of URLs
    const publicUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${filePath}`
    const signedUrl = imagekit.url({
      path: filePath,
      signed: true,
      expireSeconds: 3600 // 1 hour
    })
    const transformedUrl = imagekit.url({
      path: filePath,
      transformation: [{
        height: 300,
        width: 300,
        crop: 'maintain_ratio'
      }]
    })

    return NextResponse.json({
      success: true,
      urls: {
        public: publicUrl,
        signed: signedUrl,
        transformed: transformedUrl
      },
      config: {
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.substring(0, 10) + '...'
      }
    })
  } catch (error) {
    console.error('Error generating URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate URLs' },
      { status: 500 }
    )
  }
}
