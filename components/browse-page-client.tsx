"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import SearchFilters from "@/components/search-filters"
import EscapeRoomGrid from "@/components/escape-room-grid"
import { getEscapeRooms, getDatabaseStats, getThemesWithCounts, formatRoomForDisplay } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { SharedBreadcrumb, createBrowseBreadcrumbs } from "@/components/shared-breadcrumb"
import Head from 'next/head'
import { renderStructuredData, createStructuredData } from '@/lib/structured-data'

export default function BrowsePageClient() {
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<Array<{
    id: string
    escape_room_name: string
    business_name?: string
    city: string
    state: string
    rating?: number
    review_count?: number
    min_players?: number
    max_players?: number
    duration_minutes?: number
    price_per_person?: number
    themes?: string[]
    images?: string[]
    description?: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const roomsPerPage = 24
  const [stats, setStats] = useState({
    totalRooms: 0,
    uniqueCities: 0,
    uniqueStates: 0,
    totalThemes: 0,
    averageRating: 4.2
  })
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    state: '',
    country: '',
    category: ''
  })

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = {
      name: searchParams.get('name') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      country: searchParams.get('country') || '',
      category: searchParams.get('category') || ''
    }
    setFilters(urlFilters)
    
    const page = searchParams.get('page')
    if (page) {
      setCurrentPage(parseInt(page))
    }
  }, [searchParams])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [filters])

  useEffect(() => {
    loadRooms()
  }, [currentPage, filters])

  useEffect(() => {
    loadStats()
  }, [])

  const loadRooms = async () => {
    setLoading(true)
    try {
      const { data, count } = await getEscapeRooms({
        limit: roomsPerPage,
        offset: (currentPage - 1) * roomsPerPage,
        name: filters.name || undefined,
        city: filters.city || undefined,
        state: filters.state || undefined,
        country: filters.country || undefined,
        category: filters.category || undefined
      })
      const formattedRooms = (data || []).map(formatRoomForDisplay)
      setRooms(formattedRooms)
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error loading rooms:', error)
      setRooms([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const [dbStats, themesData] = await Promise.all([
        getDatabaseStats(),
        getThemesWithCounts()
      ])
      
      setStats({
        totalRooms: dbStats.totalRooms || 0,
        uniqueCities: dbStats.uniqueCities || 0,
        uniqueStates: dbStats.uniqueStates || 0,
        totalThemes: themesData.data?.length || 0,
        averageRating: dbStats.averageRating || 4.2
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Generate structured data for search results
  const generateStructuredData = () => {
    const baseUrl = 'https://escaperoomsfinder.com'
    
    // Search results page structured data using utility function
    const searchResultsStructuredData = createStructuredData("SearchResultsPage", {
      "name": "Browse Escape Rooms",
      "description": `Find escape rooms across the United States. Browse ${stats.totalRooms.toLocaleString()} escape room adventures.`,
      "url": `${baseUrl}/browse`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalCount,
        "itemListElement": rooms.slice(0, 10).map((room, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "@id": `${baseUrl}/locations/united-states/${room.state?.toLowerCase().replace(/\s+/g, '-')}/${room.city?.toLowerCase().replace(/\s+/g, '-')}/${room.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            "name": room.name,
            "description": room.description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": room.full_address,
              "addressLocality": room.city,
              "addressRegion": room.state,
              "addressCountry": "US",
              "postalCode": room.postal_code
            },
            "geo": room.latitude && room.longitude ? {
              "@type": "GeoCoordinates",
              "latitude": room.latitude,
              "longitude": room.longitude
            } : undefined,
            "aggregateRating": room.rating ? {
              "@type": "AggregateRating",
              "ratingValue": room.rating,
              "ratingCount": room.reviews_count || 1
            } : undefined,
            "url": room.website,
            "telephone": room.phone,
            "priceRange": "$$",
            "category": "Entertainment"
          }
        }))
      }
    })

    return searchResultsStructuredData
  }

  const searchResultsStructuredData = generateStructuredData()

  // Generate pagination meta tags
  const generatePaginationMeta = () => {
    const baseUrl = 'https://escaperoomsfinder.com/browse'
    const params = new URLSearchParams()
    
    if (filters.city) params.set('city', filters.city)
    if (filters.state) params.set('state', filters.state)
    if (filters.category) params.set('category', filters.category)
    if (filters.name) params.set('name', filters.name)
    
    const baseUrlWithParams = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
    const totalPages = Math.ceil(totalCount / roomsPerPage)
    
    const paginationMeta = []
    
    // Previous page
    if (currentPage > 1) {
      const prevPage = currentPage - 1
      const prevUrl = prevPage === 1 ? baseUrlWithParams : `${baseUrlWithParams}${baseUrlWithParams.includes('?') ? '&' : '?'}page=${prevPage}`
      paginationMeta.push(<link key="prev" rel="prev" href={prevUrl} />)
    }
    
    // Next page
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1
      const nextUrl = `${baseUrlWithParams}${baseUrlWithParams.includes('?') ? '&' : '?'}page=${nextPage}`
      paginationMeta.push(<link key="next" rel="next" href={nextUrl} />)
    }
    
    return paginationMeta
  }

  return (
    <>
      <Head>
        {renderStructuredData(searchResultsStructuredData)}
        {generatePaginationMeta()}
      </Head>
      <div className="min-h-screen bg-background">

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <SharedBreadcrumb items={createBrowseBreadcrumbs()} />
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 overflow-hidden" 
        style={{
          backgroundImage: 'url(/images/escape-room-browse.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        <div className="absolute inset-0 opacity-20">
          {/* Enhanced atmospheric elements matching homepage */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500" />
        </div>
        
        {/* Enhanced mystery elements with more visibility */}
        <div className="absolute inset-0 opacity-20 -z-10">
          <div className="absolute top-1/4 left-1/6 text-6xl animate-mystery-float pointer-events-none drop-shadow-2xl">🔍</div>
          <div className="absolute top-3/4 right-1/5 text-5xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">🗝️</div>
          <div className="absolute top-1/2 right-1/4 text-4xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">🔐</div>
          <div className="absolute bottom-1/4 left-1/4 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">⏱️</div>
          <div className="absolute top-1/3 right-1/6 text-3xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">🧩</div>
          <div className="absolute bottom-1/3 left-1/5 text-4xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🎯</div>
        </div>

        {/* Additional geometric background elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
          <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
        </div>

        {/* Glowing accent lines */}
        <div className="absolute inset-0 opacity-15 -z-10">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
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
              <Building2 className="h-8 w-8 text-escape-red" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Browse All Escape Rooms
            </h1>
            {statsLoading ? (
              <div className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
              </div>
            ) : (
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover over {stats.totalRooms.toLocaleString()} thrilling escape room adventures across {stats.uniqueCities} cities and {stats.uniqueStates} states worldwide. Filter by location and theme to find your perfect challenge.
                <br className="hidden sm:block" />
                <span className="text-escape-red-300">Unlock your next great adventure!</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
              ) : (
                <div className="text-2xl font-bold text-escape-red">{stats.totalRooms.toLocaleString()}+</div>
              )}
              <div className="text-sm text-muted-foreground">Total Rooms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
              ) : (
                <div className="text-2xl font-bold text-escape-red">{stats.uniqueCities}+</div>
              )}
              <div className="text-sm text-muted-foreground">Cities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {statsLoading ? (
                 <Skeleton className="h-8 w-16 mx-auto mb-2" />
               ) : (
                 <div className="text-2xl font-bold bg-gradient-to-r from-escape-red to-escape-red-600 bg-clip-text text-transparent">{stats.uniqueStates}</div>
               )}
              <div className="text-sm text-muted-foreground">States</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
              ) : (
                <div className="text-2xl font-bold bg-gradient-to-r from-escape-red-600 to-escape-red-700 bg-clip-text text-transparent">{stats.totalThemes}+</div>
              )}
              <div className="text-sm text-muted-foreground">Themes</div>
            </CardContent>
          </Card>
        </div>

        <SearchFilters onFiltersChange={setFilters} />

        <EscapeRoomGrid 
           rooms={rooms} 
           loading={loading} 
           currentPage={currentPage}
           totalCount={totalCount}
           roomsPerPage={roomsPerPage}
           onPageChange={setCurrentPage}
           showPagination={true}
         />
        </div>
      </div>
    </>
  )
}