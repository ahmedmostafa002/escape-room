"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Key, Lock, Clock, Search, Puzzle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import EscapeRoomCard from "@/components/escape-room-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getEscapeRoomsByState, getCitiesWithCounts, formatRoomForDisplay, formatStateForURL, formatCityForURL, parseStateFromURL, getFullStateName, getStatesWithRoomCounts } from "@/lib/supabase"

interface StatePageClientProps {
  country: string
  state: string
}

export default function StatePageClient({ country, state }: StatePageClientProps) {
  const [stateData, setStateData] = useState<any>(null)
  const [cities, setCities] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stateName, setStateName] = useState<string>('')
  const [countryName, setCountryName] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    async function loadStateData() {
      try {
        setLoading(true)
        setError(null)
        
        // Get the country and state name
        const resolvedStateName = parseStateFromURL(state)
        const fullStateName = getFullStateName(resolvedStateName)
        const resolvedCountryName = country
        setStateName(fullStateName)
        setCountryName(resolvedCountryName)
        
        // Load escape rooms for this state
        const { data: roomsData, error: roomsError } = await getEscapeRoomsByState(resolvedStateName, 50)
        if (roomsError) {
          throw new Error('Failed to load escape rooms')
        }
        

        
        // Load cities for this state
        const { data: citiesData, error: citiesError } = await getCitiesWithCounts(resolvedStateName)
        if (citiesError) {
          console.error('Cities error:', citiesError)
          throw new Error('Failed to load cities')
        }
        
        // Get cached state counts to ensure consistency with country page
        const { data: statesWithCounts, error: statesError } = await getStatesWithRoomCounts(resolvedCountryName === 'united-states' ? 'United States' : resolvedCountryName)
        if (statesError) {
          console.error('States counts error:', statesError)
        }
        
        // Find the current state's cached counts
        const currentStateData = statesWithCounts?.find(s => 
          s.fullName.toLowerCase() === fullStateName.toLowerCase() || 
          s.state.toLowerCase() === resolvedStateName.toLowerCase()
        )
        

        
        // Format the data
        const formattedRooms = roomsData.map(formatRoomForDisplay)
        const topCities = citiesData.slice(0, 8) // Show top 8 cities
        
        // Set state data using cached counts for consistency
        const getCountryImage = () => {
          switch (countryName) {
            case 'usa':
              return '/images/united states.jpg'
            case 'canada':
              return '/images/canada.jpg'
            case 'uk':
              return '/images/united kingdom.jpg'
            default:
              return '/images/united states.jpg'
          }
        }

        setStateData({
          name: fullStateName,
          totalRooms: currentStateData?.room_count || roomsData.length,
          totalCities: currentStateData?.city_count || citiesData.length,
          image: getCountryImage(),
        })
        
        setCities(topCities.map(city => ({
          name: city.city,
          rooms: city.count,
        })))
        
        setRooms(formattedRooms.slice(0, 6)) // Show top 6 featured rooms
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    loadStateData()
  }, [country, state, mounted])

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!stateData || !stateName || !countryName) return null

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
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
              "name": "Locations",
              "item": "https://escaperoomsfinder.com/locations"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": countryName === 'united-states' ? 'United States' : countryName.charAt(0).toUpperCase() + countryName.slice(1),
              "item": `https://escaperoomsfinder.com/locations/${countryName}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": stateName,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": `Escape Rooms in ${stateName}`,
          "description": `Discover thrilling escape room adventures across multiple cities in ${stateName}. Find the best escape rooms with reviews, ratings, and booking information.`,
          "url": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": stateData.totalRooms,
            "itemListElement": rooms.map((room, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "LocalBusiness",
                "@id": `https://escaperoomsfinder.com/escape-room/${room.slug}`,
                "name": room.name,
                "description": room.description,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": room.city,
                  "addressRegion": stateName,
                  "addressCountry": countryName === 'united-states' ? 'US' : countryName.toUpperCase()
                },
                "aggregateRating": room.rating ? {
                  "@type": "AggregateRating",
                  "ratingValue": room.rating,
                  "ratingCount": room.reviewCount || 1
                } : undefined
              }
            }))
          }
        }
      ]
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    )
  }

  if (!mounted) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading {stateName}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Structured Data */}
      {generateStructuredData()}
      
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
                  <BreadcrumbLink href="/locations">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/locations/${countryName}`}>
                    {countryName === 'united-states' ? 'United States' : countryName.charAt(0).toUpperCase() + countryName.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{stateName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <section 
          className="relative text-white py-20 overflow-hidden" 
          style={{
            backgroundImage: 'url(/images/escape-room-states.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
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
                <MapPin className="h-8 w-8 text-escape-red" />
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/locations/${countryName}`}
                    className="text-escape-red hover:text-escape-red-600 transition-colors font-medium"
                  >
                    {countryName === 'united-states' ? 'United States' : countryName.charAt(0).toUpperCase() + countryName.slice(1)}
                  </Link>
                  <span className="text-gray-400">→</span>
                  <span className="text-white font-medium">{stateName}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
                  Best Escape Rooms in {stateName}
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {loading ? (
                  <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
                ) : (
                  <>
                    Discover thrilling escape room adventures across multiple cities in {stateName}. From mind-bending puzzles to immersive storylines, find your next challenge.
                    <br className="hidden sm:block" />
                    <span className="text-escape-red-300">Find escape rooms in this state!</span>
                  </>
                )}
              </p>
              

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Cities Grid */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Popular Cities in {stateName}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-32" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-6">
                {cities.map((city, index) => {
                  const colorIndex = index % 4;
                  const colors = {
                    0: { bg: 'bg-gradient-to-br from-escape-red to-escape-red-600', text: 'text-escape-red', icon: Key },
                    1: { bg: 'bg-gradient-to-br from-escape-red-600 to-escape-red-700', text: 'text-escape-red-600', icon: Lock },
                    2: { bg: 'bg-gradient-to-br from-escape-red-700 to-escape-red-800', text: 'text-escape-red-700', icon: Puzzle },
                    3: { bg: 'bg-gradient-to-br from-escape-red-500 to-escape-red-600', text: 'text-escape-red-500', icon: Search }
                  };
                  
                  const color = colors[colorIndex as keyof typeof colors];
                  const IconComponent = color.icon;
                  
                  return (
                    <Link 
                      key={city.name} 
                      href={`/locations/${countryName}/${formatStateForURL(stateName)}/${formatCityForURL(city.name)}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:shadow-escape-red/20 border-2 rounded-xl overflow-hidden group-hover:-translate-y-3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:border-escape-red/50 relative group cursor-pointer">
                        {/* Atmospheric Background Elements */}
                        <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                          <div className="absolute top-3 right-3 w-12 h-12 bg-escape-red rounded-full blur-xl animate-pulse" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 bg-escape-red-600 rounded-full blur-lg animate-pulse delay-700" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-escape-red-700/20 rounded-full blur-2xl" />
                        </div>
                        
                        {/* Mystery Elements */}
                        <div className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-500 -z-10">
                          <div className="absolute top-4 left-4 text-lg animate-mystery-float pointer-events-none">🔍</div>
                          <div className="absolute top-1/3 right-6 text-sm animate-mystery-float delay-300 pointer-events-none">🗝️</div>
                          <div className="absolute bottom-6 right-4 text-sm animate-mystery-float delay-600 pointer-events-none">🔐</div>
                          <div className="absolute bottom-1/3 left-6 text-sm animate-mystery-float delay-900 pointer-events-none">⏱️</div>
                        </div>
                        
                        {/* Glowing Particles */}
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                          <div className="absolute top-1/4 left-1/3 w-0.5 h-0.5 bg-escape-red rounded-full animate-ping" />
                          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-500" />
                          <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-escape-red-600 rounded-full animate-ping delay-1000" />
                        </div>
                        
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${color.text} bg-gradient-to-br from-escape-red/20 to-escape-red/10 shadow-xl border border-escape-red/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="text-xs font-medium bg-escape-red/20 text-escape-red-300 border-escape-red/30">
                              <Clock className="h-3 w-3 mr-1" />
                              City
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-escape-red-200 transition-colors duration-300 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-escape-red-200 group-hover:to-white">
                            {city.name}
                          </h3>
                          
                          <p className="text-sm text-gray-300 mb-4 group-hover:text-gray-200 transition-colors leading-relaxed">
                            Discover exciting escape room adventures in {city.name}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                              <Building2 className="h-4 w-4 text-escape-red" />
                              <span>{city.rooms} rooms</span>
                            </div>
                            <div className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-all duration-300 ${color.bg} hover:shadow-lg group-hover:shadow-escape-red/20 flex items-center gap-1 group-hover:scale-105`}>
                              <Key className="h-3 w-3 transition-transform group-hover:rotate-12" />
                              Explore
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No cities found for {stateName}</p>
              </div>
            )}
          </section>

          {/* Featured Rooms */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Featured Escape Rooms in {stateName}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <EscapeRoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No escape rooms found for {stateName}</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for new listings!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}