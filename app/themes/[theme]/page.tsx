import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getEscapeRooms, formatRoomForDisplay, createSEOFriendlySlug } from "@/lib/supabase"
import { notFound } from 'next/navigation'
import ThemePageClient from "@/components/theme-page-client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { createThemeMetadata } from "@/lib/metadata"

// Helper to get the appropriate image based on theme name
const getThemeImage = (themeName: string) => {
  const themeImages: { [key: string]: string } = {
    'Adventure Escape Rooms': '/images/adventure escape rooms.jpeg',
    'Mixed Escape Rooms': '/images/mixed escape rooms.jpeg',
    'Mystery Escape Rooms': '/images/mystery escape rooms.jpeg',
    'Horror Escape Rooms': '/images/horror escape rooms.jpeg',
    'Fantasy Escape Rooms': '/images/fantasy escape room.jpeg',
    'Crime Escape Rooms': '/images/mystery escape rooms.jpeg',
    'Entertainment Escape Rooms': '/images/entertainment escape rooms.jpeg',
    'VR Escape Rooms': '/images/vr escape rooms.jpeg',
    'Historical Escape Rooms': '/images/historical escape rooms.jpeg',
    'Sci-Fi Escape Rooms': '/images/sci-fi escape rooms.png',
  };
  
  // Check for exact match first
  if (themeImages[themeName]) {
    return themeImages[themeName];
  }
  
  // Check for partial matches (case insensitive)
  const lowerTheme = themeName.toLowerCase();
  for (const [key, value] of Object.entries(themeImages)) {
    if (lowerTheme.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTheme)) {
      return value;
    }
  }
  
  // Default fallback image
  return '/images/adventure escape rooms.jpeg';
};

// Convert slug back to theme name
const parseThemeFromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params
  const themeSlug = theme
  const roomsPerPage = 24
  
  // Parse theme name from slug
  const parsedThemeName = parseThemeFromSlug(themeSlug)
  
  // Get all rooms to find matching themes
  const { data: allRooms } = await getEscapeRooms({ limit: 10000 })
  
  // Find rooms that match the theme (case-insensitive partial match)
  const matchingRooms = allRooms.filter(room => {
    if (!room.category_new) return false
    const roomTheme = room.category_new.toLowerCase()
    const searchTheme = parsedThemeName.toLowerCase()
    
    // Check for exact match or partial match
    return roomTheme.includes(searchTheme) || 
           searchTheme.includes(roomTheme) ||
           createSEOFriendlySlug(room.category_new || '') === themeSlug
  })
  
  if (matchingRooms.length === 0) {
    notFound()
  }
  
  // Get actual theme name from database
  const themeName = matchingRooms[0]?.category_new || parsedThemeName
  const totalCount = matchingRooms.length
  
  // Format all matching rooms for display
  const formattedRooms = matchingRooms.map(formatRoomForDisplay)

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://escaperoomsfinder.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Themes",
            "item": "https://escaperoomsfinder.com/themes"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": themeName,
            "item": `https://escaperoomsfinder.com/themes/${themeSlug}`
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": `${themeName} Escape Rooms`,
        "description": `Discover ${totalCount} amazing ${themeName.toLowerCase()} across the United States. Find ratings, reviews, and book your perfect themed escape room adventure.`,
        "url": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": totalCount,
          "itemListElement": formattedRooms.slice(0, 10).map((room, index) => ({
            "@type": "LocalBusiness",
            "position": index + 1,
            "name": room.name,
            "description": room.description || `Experience ${room.name}, an exciting ${themeName.toLowerCase()} escape room.`,
            "url": `https://escaperoomsfinder.com/locations/united-states/${room.state?.toLowerCase().replace(/\s+/g, '-')}/${room.city?.toLowerCase().replace(/\s+/g, '-')}/${room.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": room.address,
              "addressLocality": room.city,
              "addressRegion": room.state,
              "addressCountry": "US"
            },
            "geo": room.latitude && room.longitude ? {
              "@type": "GeoCoordinates",
              "latitude": room.latitude,
              "longitude": room.longitude
            } : undefined,
            "telephone": room.phone,
            "aggregateRating": room.rating ? {
              "@type": "AggregateRating",
              "ratingValue": room.rating,
              "ratingCount": room.reviews || 1,
              "bestRating": 5,
              "worstRating": 1
            } : undefined
          }))
        },
        "breadcrumb": {
          "@id": "#breadcrumb"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "url": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "name": `${themeName} Escape Rooms | Find ${totalCount} Adventures`,
        "description": `Discover ${totalCount} amazing ${themeName.toLowerCase()} across the United States. Find ratings, reviews, and book your perfect themed escape room adventure.`,
        "isPartOf": {
          "@type": "WebSite",
        "name": "Escape Rooms Finder",
        "url": "https://escaperoomsfinder.com"
        },
        "breadcrumb": {
          "@id": "#breadcrumb"
        }
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
                <BreadcrumbLink href="/themes">Themes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{themeName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1f2e] via-[#232937] to-[#2a3441] text-white py-20">
        <div className="absolute inset-0">
          <Image
            src={getThemeImage(themeName)}
            alt={`${themeName} - Discover ${totalCount} themed escape room adventures across the United States`}
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="mb-6">
            <Link href="/themes">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all duration-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Themes
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{themeName}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover {totalCount} amazing {themeName.toLowerCase()} across the United States. 
              Find the perfect themed escape room adventure for your group.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm hover:bg-white/20 transition-all duration-300">
                {totalCount} rooms available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Component for Interactive Features */}
      <ThemePageClient 
        rooms={formattedRooms}
        roomsPerPage={roomsPerPage}
        themeName={themeName}
      />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params
  const themeSlug = theme
  const themeName = parseThemeFromSlug(themeSlug)
  
  // Get room count for this theme
  const { data: allRooms } = await getEscapeRooms({ limit: 10000 })
  const matchingRooms = allRooms.filter(room => {
    if (!room.category_new) return false
    const roomTheme = room.category_new.toLowerCase()
    const searchTheme = themeName.toLowerCase()
    return roomTheme.includes(searchTheme) || 
           searchTheme.includes(roomTheme) ||
           createSEOFriendlySlug(room.category_new || '') === themeSlug
  })
  
  const roomCount = matchingRooms.length
  
  return createThemeMetadata(
    themeName,
    roomCount
  )
}