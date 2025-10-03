import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBlogPostBySeoSlug, getAllBlogPosts, formatDate, getImageUrl, calculateReadTime, createSeoSlug, BlogPost, getBlogPosts } from "@/lib/sanity"
import { getFeaturedEscapeRooms } from "@/lib/supabase"
import { createBlogPostMetadata } from '@/lib/metadata'
import { PortableText } from '@portabletext/react'
import BlogSidebar from '@/components/blog-sidebar'
import RelatedPosts from '@/components/related-posts'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

interface ImageValue {
  asset: {
    _ref: string
  }
  alt?: string
}

interface TableRow {
  cells: Array<{
    isHeader?: boolean
    text?: string
  }>
}

interface BlockValue {
  _type: string
  children?: Array<{
    text?: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts()
    return posts.map((post) => ({
      slug: createSeoSlug(post.slug.current),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = await getBlogPostBySeoSlug(resolvedParams.slug)
    
    if (!post) {
      return {
        title: 'Blog Post Not Found - Escape Room Directory',
        description: 'The requested blog post could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    // const imageUrl = post.image ? getImageUrl(post.image, 1200, 630) : 'https://escaperoomsfinder.com/images/blog-default.jpg'
    // const readTime = post.readTime || calculateReadTime(post.content)
    const publishDate = new Date(post.publishedAt).toISOString()
    const modifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishDate
    
    return createBlogPostMetadata(
      post.title,
      post.excerpt || `Discover insights about ${post.title}. Read our comprehensive guide on escape rooms.`,
      resolvedParams.slug,
      publishDate,
      modifiedDate
    )
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post - Escape Room Directory',
      description: 'Read our latest blog post about escape rooms.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }
}

// Portable Text components for rich content rendering - Escape Room Themed
const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <div className="my-12 group">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={getImageUrl(value, 800, 600)}
            alt={value.alt || 'Blog post image'}
            width={800}
            height={600}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {value.caption && (
          <p className="text-sm text-gray-600 text-center mt-4 italic bg-escape-red/5 px-4 py-2 rounded-lg border border-escape-red/20">
            {value.caption}
          </p>
        )}
      </div>
    ),
    table: ({ value }: { value: { rows: TableRow[] } }) => (
      <div className="my-8 overflow-x-auto rounded-2xl shadow-lg border border-escape-red/20">
        <table className="min-w-full border-collapse">
          {value.rows?.map((row: TableRow, rowIndex: number) => (
            <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gradient-to-r from-escape-red/10 to-escape-red/5' : 'bg-white hover:bg-escape-red/5 transition-colors'}>
              {row.cells?.map((cell, cellIndex: number) => {
                const CellTag = row.cells.some((c) => c.isHeader) ? 'th' : 'td'
                return (
                  <CellTag
                    key={cellIndex}
                    className={`border border-escape-red/20 px-6 py-4 text-sm ${
                      cell.isHeader ? 'font-bold bg-escape-red/10 text-escape-red-800' : 'text-gray-700'
                    }`}
                  >
                    {cell.content}
                  </CellTag>
                )
              })}
            </tr>
          ))}
        </table>
      </div>
    ),
  },
  block: {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-8 mt-12 relative">
        <span className="bg-gradient-to-r from-escape-red to-escape-red-700 bg-clip-text text-transparent">
          {children}
        </span>
        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-escape-red to-escape-red-600 rounded-full"></div>
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-10 relative group">
        <span className="bg-gradient-to-r from-gray-900 to-escape-red-800 bg-clip-text text-transparent">
          {children}
        </span>
        <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div>
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8 flex items-center gap-3">
        <div className="w-2 h-2 bg-escape-red rounded-full"></div>
        {children}
      </h3>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-escape-red pl-8 my-8 italic text-gray-700 bg-gradient-to-r from-escape-red/5 to-escape-red/10 py-6 rounded-r-2xl relative">
        <div className="absolute top-4 left-4 text-2xl text-escape-red/30">💡</div>
        <div className="ml-6">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-none text-gray-700 mb-6 space-y-3">
        {children}
      </ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-none text-gray-700 mb-6 space-y-3">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="flex items-start gap-3">
        <div className="w-2 h-2 bg-escape-red rounded-full mt-3 flex-shrink-0"></div>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <li className="flex items-start gap-3">
        <div className="w-6 h-6 bg-escape-red text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
          {children}
        </div>
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">
        {children}
      </strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-escape-red-700 font-medium">
        {children}
      </em>
    ),
    link: ({ children, value }: { children: React.ReactNode; value: { href: string } }) => (
      <a 
        href={value.href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-escape-red hover:text-escape-red-700 underline decoration-escape-red/50 hover:decoration-escape-red transition-all duration-300 font-medium"
      >
        {children}
      </a>
    ),
  },
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  let post: BlogPost | null = null
  let error: string | null = null

  try {
    post = await getBlogPostBySeoSlug(resolvedParams.slug)
  } catch (err) {
    console.error('Error fetching blog post:', err)
    error = 'Failed to load blog post'
  }

  if (!post && !error) {
    notFound()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Post</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/blog">
            <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return null // This should not happen due to notFound() above
  }

  // Get related posts and nearby escape rooms for sidebar
  const allPosts = await getBlogPosts()
  const relatedPosts = allPosts
    .filter(p => p._id !== post!._id)
    .slice(0, 3)
  
  // Debug logging
  console.log('All posts count:', allPosts.length)
  console.log('Related posts count:', relatedPosts.length)
  console.log('Current post ID:', post._id)

  // Get real nearby escape rooms data
  const { data: escapeRoomsData } = await getFeaturedEscapeRooms(3)
  const nearbyEscapeRooms = escapeRoomsData.map(room => ({
    id: room.id,
    name: room.name,
    location: `${room.city || ''}, ${room.state || ''}`.replace(/^,\s*|,\s*$/g, ''),
    rating: room.rating || null,
    difficulty: room.category_new || 'Medium',
    duration: '60 min',
    players: '2-6',
    image: room.photo || '/placeholder.jpg',
    city: room.city,
    state: room.state
  }))

  // Generate structured data for SEO
  const canonicalUrl = `https://escaperoomsfinder.com/blog/${resolvedParams.slug}`
  const imageUrl = post.image ? getImageUrl(post.image, 1200, 630) : 'https://escaperoomsfinder.com/images/blog-default.jpg'
  const readTime = post.readTime || calculateReadTime(post.content)
  const publishDate = new Date(post.publishedAt).toISOString()
  const modifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishDate
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": post.title,
        "description": post.excerpt || `Discover insights about ${post.title}. Read our comprehensive guide on escape rooms, puzzles, and team-building activities.`,
        "image": {
          "@type": "ImageObject",
          "@id": `${canonicalUrl}#primaryimage`,
          "url": imageUrl,
          "contentUrl": imageUrl,
          "width": 1200,
          "height": 630,
          "caption": post.image?.alt || post.title
        },
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "author": {
          "@type": "Person",
          "@id": "https://escaperoomsfinder.com/#person",
          "name": post.author?.name || "Escape Rooms Finder Team",
          "url": "https://escaperoomsfinder.com/about"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://escaperoomsfinder.com/#organization",
          "name": "Escape Rooms Finder",
          "url": "https://escaperoomsfinder.com",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://escaperoomsfinder.com/#logo",
            "url": "https://escaperoomsfinder.com/logo.png",
            "contentUrl": "https://escaperoomsfinder.com/logo.png",
            "width": 512,
            "height": 512,
            "caption": "Escape Rooms Finder"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "articleSection": post.category || "Escape Rooms",
          "keywords": [
            "escape room blog",
            "escape room articles",
            "escape room tips",
            "escape room guides",
            "puzzle solving",
            "team building",
            post.category?.toLowerCase(),
          ...post.title.toLowerCase().split(' ').filter(word => word.length > 3)
        ].filter(Boolean),
        "wordCount": post.content ? post.content.reduce((count: number, block: BlockValue) => {
          if (block._type === 'block' && block.children) {
            return count + block.children.reduce((childCount: number, child: { text?: string }) => {
              return childCount + (child.text ? child.text.split(' ').length : 0)
            }, 0)
          }
          return count
        }, 0) : 0,
        "timeRequired": `PT${readTime}`,
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://escaperoomsfinder.com/blog#blog",
          "name": "Escape Rooms Finder Blog",
          "description": "Expert insights, tips, and guides for escape room enthusiasts",
          "url": "https://escaperoomsfinder.com/blog"
        }
      },
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#blogposting`,
        "headline": post.title,
        "description": post.excerpt || `Discover insights about ${post.title}. Read our comprehensive guide on escape rooms, puzzles, and team-building activities.`,
        "image": `${canonicalUrl}#primaryimage`,
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "author": `https://escaperoomsfinder.com/#person`,
        "publisher": `https://escaperoomsfinder.com/#organization`,
        "mainEntityOfPage": canonicalUrl,
        "url": canonicalUrl,
        "blogPost": `${canonicalUrl}#article`
      },
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        "url": canonicalUrl,
        "name": post.title,
        "description": post.excerpt || `Discover insights about ${post.title}. Read our comprehensive guide on escape rooms, puzzles, and team-building activities.`,
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "primaryImageOfPage": `${canonicalUrl}#primaryimage`,
        "breadcrumb": `${canonicalUrl}#breadcrumb`,
        "mainEntity": `${canonicalUrl}#article`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://escaperoomsfinder.com/#website",
          "name": "Escape Rooms Finder",
          "description": "Find and book the best escape rooms near you",
          "url": "https://escaperoomsfinder.com",
          "publisher": `https://escaperoomsfinder.com/#organization`
        },
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [canonicalUrl]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://escaperoomsfinder.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://escaperoomsfinder.com/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://escaperoomsfinder.com/#website",
        "name": "Escape Rooms Finder",
        "description": "Find and book the best escape rooms near you",
        "url": "https://escaperoomsfinder.com",
        "publisher": `https://escaperoomsfinder.com/#organization`,
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://escaperoomsfinder.com/browse?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section - Escape Room Themed */}
      <div className="relative overflow-hidden py-12">
        {/* Featured Image Background with Enhanced Overlay */}
        {post.image && (
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(post.image, 1200, 600)}
              alt={post.image.alt || post.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
          </div>
        )}
        
        {/* Atmospheric Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Mystery Elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-1/4 left-1/6 text-4xl animate-mystery-float pointer-events-none">🔍</div>
          <div className="absolute top-3/4 right-1/5 text-3xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
          <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500 pointer-events-none">🔐</div>
          <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500 pointer-events-none">⏱️</div>
          <div className="absolute top-1/3 right-1/6 text-2xl animate-mystery-float delay-2000 pointer-events-none">🧩</div>
        </div>
        
        {/* Glowing Particles Effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Category Badge with Escape Room Styling */}
            {post.category && (
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-escape-red to-escape-red-700 text-white font-bold px-4 py-2 text-sm shadow-2xl hover:from-escape-red-600 hover:to-escape-red-800 transition-all duration-300">
                  🗝️ {post.category}
                </Badge>
              </div>
            )}
            
            {/* Title with Escape Room Gradient */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-escape-red-100 to-white bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            
            {/* Excerpt with Enhanced Styling */}
            {post.excerpt && (
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200 max-w-3xl mx-auto">
                {post.excerpt}
              </p>
            )}
            
            {/* Meta Information with Escape Room Theme */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 text-gray-300 mb-6">
              <div className="flex items-center gap-2 md:gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 border border-escape-red/30">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-escape-red" />
                <span className="font-semibold text-sm md:text-base">{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 border border-escape-red/30">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-escape-red-600" />
                <span className="font-semibold text-sm md:text-base">{post.readTime || calculateReadTime(post.content)}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-escape-red/20 border border-escape-red/30 rounded-full px-4 md:px-6 py-2 md:py-3 backdrop-blur-sm text-sm md:text-base"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Share Article</span>
                <span className="sm:hidden">Share</span>
              </Button>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-escape-red/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-escape-red/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar - Escape Room Themed */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-16">
        {/* Background Atmospheric Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-32 h-32 bg-escape-red rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-escape-red-600 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
                {/* Card Header with Escape Room Theme */}
                <div className="bg-gradient-to-r from-escape-red/5 via-escape-red/10 to-escape-red/5 border-b border-escape-red/20 p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-escape-red/20 rounded-full flex items-center justify-center">
                      <span className="text-escape-red text-sm md:text-lg">📝</span>
                    </div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900">Article Content</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-escape-red rounded-full"></div>
                      <span>Escape Room Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-escape-red-600 rounded-full"></div>
                      <span>Expert Tips</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4 md:p-6 lg:p-8">
                  <div className="prose prose-sm md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-escape-red prose-strong:text-gray-900 prose-code:text-escape-red-600 prose-blockquote:text-gray-700 prose-blockquote:border-escape-red prose-blockquote:bg-escape-red/5">
                    {post.content && post.content.length > 0 ? (
                      <PortableText 
                        value={post.content} 
                        components={portableTextComponents}
                      />
                    ) : (
                      <div className="text-center py-12 md:py-16">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-escape-red/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                          <span className="text-2xl md:text-3xl">🔍</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Content Coming Soon...</h3>
                        <p className="text-gray-600 text-base md:text-lg mb-2">This article is being prepared and will be available shortly.</p>
                        <p className="text-gray-500 text-sm md:text-base">Stay tuned for exciting escape room insights!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar 
                nearbyEscapeRooms={nearbyEscapeRooms}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts Section */}
      <RelatedPosts relatedPosts={relatedPosts} />
    </div>
  )
}