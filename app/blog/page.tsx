import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { getAllBlogPosts, formatDate, getImageUrl, calculateReadTime, createSeoSlug, BlogPost } from "@/lib/sanity"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: 'Escape Room Blog | Guides & Insights | Escape Rooms Finder',
  description: 'Discover the latest escape room trends, expert tips, puzzle-solving strategies, and insights from our community of enthusiasts. From beginner guides to advanced techniques.',
  keywords: 'escape room blog, escape room tips, puzzle solving, team building, escape room guides, escape room strategy, escape room reviews, escape room articles',
  authors: [{ name: 'Escape Rooms Finder Team' }],
  creator: 'Escape Rooms Finder Team',
  publisher: 'Escape Rooms Finder',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://escaperoomsfinder.com/blog',
  },
  openGraph: {
    title: 'Escape Room Blog | Expert Tips & Guides',
    description: 'Discover the latest escape room trends, expert tips, puzzle-solving strategies, and insights from our community of enthusiasts.',
    url: 'https://escaperoomsfinder.com/blog',
    siteName: 'Escape Rooms Finder',
    images: [
      {
        url: 'https://escaperoomsfinder.com/images/blog-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Escape Room Blog - Tips and Guides',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Escape Room Blog | Expert Tips & Guides',
    description: 'Discover the latest escape room trends, expert tips, and puzzle-solving strategies.',
    site: '@EscapeRoomsFinder',
    creator: '@EscapeRoomsFinder',
    images: ['https://escaperoomsfinder.com/images/blog-hero.jpg'],
  },
  other: {
    'geo.region': 'US',
    'geo.country': 'United States',
    'business.type': 'Entertainment',
    'content.type': 'blog',
    'content.category': 'escape rooms',
  },
}

export default async function BlogPage() {
  let blogPosts: BlogPost[] = []
  let error: string | null = null

  try {
    const allPosts = await getAllBlogPosts()
    blogPosts = allPosts.slice(0, 10) // Limit to 10 posts
  } catch (err) {
    console.error('Error fetching blog posts:', err)
    error = 'Failed to load blog posts'
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://escaperoomsfinder.com/blog#blog",
        "name": "Escape Rooms Finder Blog",
        "description": "Expert insights, tips, and guides for escape room enthusiasts. Discover the latest trends, puzzle-solving strategies, and team-building techniques.",
        "url": "https://escaperoomsfinder.com/blog",
        "inLanguage": "en-US",
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
        "blogPost": blogPosts.map(post => ({
          "@type": "BlogPosting",
          "@id": `https://escaperoomsfinder.com/blog/${createSeoSlug(post.slug.current)}#blogposting`,
          "headline": post.title,
          "description": post.excerpt || `Discover insights about ${post.title}. Read our comprehensive guide on escape rooms.`,
          "url": `https://escaperoomsfinder.com/blog/${createSeoSlug(post.slug.current)}`,
          "datePublished": new Date(post.publishedAt).toISOString(),
          "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.publishedAt).toISOString(),
          "author": {
            "@type": "Person",
            "name": "Escape Rooms Finder Team"
          },
          "image": post.image ? getImageUrl(post.image, 1200, 630) : "https://escaperoomsfinder.com/images/blog-default.jpg",
          "articleSection": post.category || "Escape Rooms",
          "keywords": [post.category?.toLowerCase(), ...post.title.toLowerCase().split(' ').filter(word => word.length > 3)].filter(Boolean)
        }))
      },
      {
        "@type": "WebPage",
        "@id": "https://escaperoomsfinder.com/blog",
        "url": "https://escaperoomsfinder.com/blog",
        "name": "Escape Room Blog | Expert Tips & Guides",
        "description": "Discover the latest escape room trends, expert tips, puzzle-solving strategies, and insights from our community of enthusiasts.",
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://escaperoomsfinder.com/images/blog-hero.jpg#primaryimage",
          "url": "https://escaperoomsfinder.com/images/blog-hero.jpg",
          "contentUrl": "https://escaperoomsfinder.com/images/blog-hero.jpg",
          "width": 1200,
          "height": 630,
          "caption": "Escape Room Blog - Tips and Guides"
        },
        "breadcrumb": "https://escaperoomsfinder.com/blog#breadcrumb",
        "mainEntity": "https://escaperoomsfinder.com/blog#blog",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://escaperoomsfinder.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://escaperoomsfinder.com/blog#breadcrumb",
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
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://escaperoomsfinder.com/#website",
        "name": "Escape Rooms Finder",
        "description": "Find and book the best escape rooms near you",
        "url": "https://escaperoomsfinder.com",
        "publisher": "https://escaperoomsfinder.com/#organization",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative py-20 overflow-hidden" 
        style={{
          backgroundImage: 'url(/images/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        
        {/* Enhanced atmospheric elements matching homepage */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500" />
        </div>
        
        {/* Mystery elements matching homepage */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-1/4 left-1/6 text-4xl animate-mystery-float pointer-events-none">🔍</div>
          <div className="absolute top-3/4 right-1/5 text-3xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
          <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500 pointer-events-none">🔐</div>
          <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500 pointer-events-none">⏱️</div>
          <div className="absolute top-1/3 right-1/6 text-2xl animate-mystery-float delay-2000 pointer-events-none">🧩</div>
        </div>
        
        {/* Glowing particles effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping" />
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Escape Room Blog
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the latest escape room trends, expert tips, and insights from our community of enthusiasts. 
              From beginner guides to advanced strategies, we&apos;ve got everything you need to enhance your escape room experience.
              <br className="hidden sm:block" />
              <span className="text-escape-red-300">Master the art of escape!</span>
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          {error ? (
            // Error State
            <div className="text-center py-20">
              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto shadow-lg">
                <p className="text-escape-red mb-4 text-lg">{error}</p>
                <p className="text-gray-600 mb-6">We&apos;re having trouble loading the blog posts. Please try again later.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="border-escape-red text-escape-red hover:bg-escape-red hover:text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : blogPosts.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Blog Posts Yet</h3>
                <p className="text-gray-600 mb-6">We&apos;re working on creating amazing content for you. Check back soon!</p>
                <Link href="/">
                  <Button className="bg-escape-red hover:bg-escape-red-600 text-white">
                    Explore Escape Rooms
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Blog Posts with Sidebar Layout
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                
                <div className="space-y-6">
                {blogPosts.map((post) => (
                  <Card key={post._id} className="group hover:shadow-xl hover:shadow-escape-red/10 transition-all duration-300 border border-gray-200 shadow-sm bg-white hover:bg-gray-50 relative overflow-hidden">
                    {/* Atmospheric background elements */}
                    <div className="absolute inset-0 opacity-3 group-hover:opacity-5 transition-opacity duration-300">
                      <div className="absolute top-3 right-3 w-12 h-12 bg-escape-red rounded-full blur-xl animate-pulse" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-escape-red-600 rounded-full blur-lg animate-pulse delay-1000" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row">
                      {/* Image Section */}
                      <div className="relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none md:w-80 flex-shrink-0">
                        <Image
                          src={getImageUrl(post.image, 400, 200)}
                          alt={post.image?.alt || post.title}
                          width={400}
                          height={200}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-escape-red hover:bg-escape-red-600 text-white text-xs font-medium px-2 py-1 transition-all duration-300">
                            {post.category || 'General'}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 p-6 relative z-10">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl font-semibold line-clamp-2 text-gray-900 group-hover:text-escape-red transition-colors duration-300 leading-tight mb-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed">
                            {post.excerpt || 'Read this exciting blog post to learn more!'}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime || calculateReadTime(post.content)}</span>
                            </div>
                          </div>
                          
                          <Link href={`/blog/${createSeoSlug(post.slug.current)}`} className="inline-block">
                            <Button variant="ghost" className="text-gray-700 hover:bg-escape-red/10 hover:text-escape-red border border-transparent hover:border-escape-red/30 transition-all duration-300">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Search Widget */}
                  <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Search className="h-4 w-4 text-escape-red" />
                        Search Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="relative">
                        <Input 
                          placeholder="Search blog posts..." 
                          className="pr-10 border-gray-300 focus:border-escape-red focus:ring-escape-red/20 text-sm"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>


                  {/* Popular Posts Widget */}
                  <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">Popular Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {blogPosts.slice(0, 3).map((post) => (
                          <Link 
                            key={post._id}
                            href={`/blog/${createSeoSlug(post.slug.current)}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                  <Image
                                    src={getImageUrl(post.image, 100, 100)}
                                    alt={post.image?.alt || post.title}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-escape-red transition-colors line-clamp-2 leading-tight">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(post.publishedAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Newsletter Widget */}
                  <Card className="bg-gradient-to-br from-escape-red to-escape-red-600 text-white shadow-sm border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Stay Updated</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-escape-red-100 mb-3">
                        Get the latest escape room tips and guides delivered to your inbox.
                      </p>
                      <div className="space-y-2">
                        <Input 
                          placeholder="Your email address" 
                          className="bg-white/20 border-white/30 text-white placeholder:text-escape-red-200 focus:border-white focus:ring-white/20 text-sm"
                        />
                        <Button className="w-full bg-white text-escape-red hover:bg-escape-red-100 font-medium text-sm py-2">
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}