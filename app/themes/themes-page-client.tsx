"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getThemesWithCounts } from "@/lib/supabase"
import { createSEOFriendlySlug } from "@/lib/supabase"

// Helper to get the appropriate image based on theme name
const getThemeImage = (themeName: string) => {
  const themeImages: { [key: string]: string } = {
    'Adventure Escape Rooms': '/images/adventure escape rooms.jpeg',
    'Mixed Escape Rooms': '/images/mixed escape rooms.jpeg',
    'Mystery Escape Rooms': '/images/mystery escape rooms.jpeg',
    'Horror Escape Rooms': '/images/horror escape rooms.jpeg',
    'Fantasy Escape Rooms': '/images/fantasy escape room.jpeg',
    'Entertainment Escape Rooms': '/images/entertainment escape rooms.jpeg',
    'VR Escape Rooms': '/images/vr escape rooms.jpeg',
    'Historical Escape Rooms': '/images/historical escape rooms.jpeg',
    'Sci-Fi Escape Rooms': '/images/sci-fi escape rooms.png',
    'Crime Escape Rooms': '/images/mystery escape rooms.jpeg', // Use mystery image for crime theme
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

interface ThemesPageClientProps {
  initialThemes: any[]
}

export default function ThemesPageClient({ initialThemes }: ThemesPageClientProps) {
  const [themes, setThemes] = useState<any[]>(initialThemes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If no initial themes provided, load them
    if (initialThemes.length === 0) {
      loadThemes()
    }
  }, [initialThemes])

  const loadThemes = async () => {
    setLoading(true)
    try {
      const { data, error } = await getThemesWithCounts()
      if (error) {
        console.error('Error loading themes:', error)
        setThemes([])
      } else {
        setThemes(data || [])
      }
    } catch (error) {
      console.error('Error loading themes:', error)
      setThemes([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
                  <BreadcrumbPage>Themes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        
        <section 
          className="relative text-white py-20 overflow-hidden" 
          style={{
            backgroundImage: 'url(/images/hero.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
          
          {/* Enhanced atmospheric elements matching homepage */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500" />
          </div>
          
          {/* Mystery elements matching homepage */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/6 text-4xl animate-mystery-float">🔍</div>
            <div className="absolute top-3/4 right-1/5 text-3xl animate-mystery-float delay-1000">🗝️</div>
            <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500">🔐</div>
            <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500">⏱️</div>
            <div className="absolute top-1/3 right-1/6 text-2xl animate-mystery-float delay-2000">🧩</div>
          </div>
          
          {/* Glowing particles effect */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping" />
            <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500" />
          </div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Palette className="h-8 w-8 text-escape-red" />
              </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Explore Escape Rooms by Theme
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Loading themes...
            </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
                <BreadcrumbPage>Themes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 overflow-hidden" 
        style={{
          backgroundImage: 'url(/images/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        
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
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Palette className="h-8 w-8 text-escape-red" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Explore Escape Rooms by Theme
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              From heart-pounding horror to mind-bending mysteries, find the perfect themed 
              escape room adventure for your group.
              <br className="hidden sm:block" />
              <span className="text-escape-red-300">Unlock your next great adventure!</span>
            </p>
          </div>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {themes.map((themeData, index) => {
              const themeSlug = createSEOFriendlySlug(themeData.theme)
              return (
                <Link key={index} href={`/themes/${themeSlug}`}>
                  <Card className="overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group border-0 hover:shadow-2xl hover:shadow-escape-red/20">
                    <div className="relative h-64">
                      <Image
                        src={getThemeImage(themeData.theme)}
                        alt={`${themeData.theme} - Explore ${themeData.count} themed escape room experiences`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25 group-hover:from-escape-red/20 group-hover:via-black/60 group-hover:to-black/35 transition-all duration-300" />
                      
                      {/* Glowing border effect on hover */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-escape-red/50 transition-all duration-300 rounded-lg"></div>
                      
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-escape-red text-white border-0 shadow-lg group-hover:bg-escape-red-600 transition-colors duration-300">
                          {themeData.count} rooms
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-white">{themeData.theme}</h3>
                        <p className="text-gray-200 text-sm leading-relaxed">
                          Explore {themeData.count} {themeData.theme.toLowerCase()} across the country.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}