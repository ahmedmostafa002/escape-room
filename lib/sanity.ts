import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

// Client-side Sanity client (for browser use)
export const clientSideClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true, // Always use CDN for client-side
  // No token needed for public read access
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Blog post type definition
export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  category?: string
  publishedAt: string
  updatedAt?: string
  readTime?: string
  author?: {
    name: string
    image?: {
      asset: {
        _ref: string
        _type: 'reference'
      }
      alt?: string
    }
  }
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  content?: any[] // Rich text content from Sanity including tables
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    focusKeyword?: string
  }
  socialSharing?: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: {
      asset: {
        _ref: string
        _type: 'reference'
      }
    }
    twitterCard?: string
  }
  tags?: string[]
  _createdAt: string
  _updatedAt: string
}

// GROQ queries for fetching blog posts
export const blogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    _updatedAt,
    "updatedAt": _updatedAt,
    category,
    author {
      name,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    content
  }
`

export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    _updatedAt,
    "updatedAt": _updatedAt,
    category,
    author {
      name,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    content,
    seo,
    socialSharing,
    tags
  }
`

export const featuredBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) [0...3] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    publishedAt,
    _updatedAt,
    "updatedAt": _updatedAt,
    category,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    content
  }
`

// Helper functions for fetching data
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(blogPostsQuery)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return await client.fetch(blogPostQuery, { slug })
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(featuredBlogPostsQuery)
}

// Client-side version for browser use
export async function getFeaturedBlogPostsClient(): Promise<BlogPost[]> {
  return await clientSideClient.fetch(featuredBlogPostsQuery)
}

// Alias for getAllBlogPosts for consistency
export async function getBlogPosts(): Promise<BlogPost[]> {
  return await getAllBlogPosts()
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to generate image URL with fallback
export function getImageUrl(image?: BlogPost['image'], width = 800, height = 600): string {
  if (!image?.asset) {
    return '/placeholder.svg'
  }
  
  return urlFor(image)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .url()
}

// Helper function to calculate read time if not provided
export function calculateReadTime(content?: any[]): string {
  if (!content || content.length === 0) return '1 min read'
  
  // Rough estimation: 200 words per minute
  const wordsPerMinute = 200
  const textContent = content
    .filter(block => block._type === 'block')
    .map(block => 
      block.children
        ?.filter((child: any) => child._type === 'span')
        ?.map((span: any) => span.text)
        ?.join(' ') || ''
    )
    .join(' ')
  
  const wordCount = textContent.split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  
  return `${readTime} min read`
}

// Convert title to SEO-friendly slug
export function createSeoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Convert SEO slug back to original format for Sanity query
export function slugToTitle(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Get blog post by SEO-friendly slug
export async function getBlogPostBySeoSlug(seoSlug: string): Promise<BlogPost | null> {
  // First try to get the post by the SEO slug directly
  let post = await client.fetch(blogPostQuery, { slug: seoSlug })
  
  if (!post) {
    // If not found, try to find by converting slug back to title format
    const titleFromSlug = slugToTitle(seoSlug)
    post = await client.fetch(blogPostQuery, { slug: titleFromSlug })
  }
  
  if (!post) {
    // If still not found, get all posts and find by matching SEO slug
    const allPosts = await getAllBlogPosts()
    post = allPosts.find(p => createSeoSlug(p.slug.current) === seoSlug || p.slug.current === seoSlug) || null
  }
  
  return post
}
