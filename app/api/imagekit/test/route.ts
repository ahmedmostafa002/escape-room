import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

    return NextResponse.json({
      success: true,
      config: {
        publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : 'Not set',
        privateKey: privateKey ? `${privateKey.substring(0, 10)}...` : 'Not set',
        urlEndpoint: urlEndpoint || 'Not set',
        allSet: !!(publicKey && privateKey && urlEndpoint)
      }
    })
  } catch (error) {
    console.error('Error checking ImageKit config:', error)
    return NextResponse.json(
      { error: 'Configuration check failed' },
      { status: 500 }
    )
  }
}
