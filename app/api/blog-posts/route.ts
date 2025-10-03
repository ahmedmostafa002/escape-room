import { NextResponse } from 'next/server'
import { getFeaturedBlogPosts } from '@/lib/sanity'

export async function GET() {
  try {
    const blogPosts = await getFeaturedBlogPosts()
    return NextResponse.json({ success: true, data: blogPosts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
