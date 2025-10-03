"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Star } from "lucide-react"
import EscapeRoomCard from "@/components/escape-room-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getEscapeRoomsByCity, formatRoomForDisplay, formatStateForURL, parseStateFromURL, parseCityFromURL, supabase } from "@/lib/supabase"

// Function to get state abbreviation from database
async function getStateAbbreviation(stateName: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('geographic_regions')
      .select('code')
      .eq('type', 'state')
      .ilike('name', stateName)
      .single()
    
    if (error || !data) {
      // Fallback to first two letters if not found
      return stateName.toUpperCase().substring(0, 2)
    }
    
    return data.code
  } catch (err) {
    // Fallback to first two letters if error
    return stateName.toUpperCase().substring(0, 2)
  }
}

interface CityPageClientProps {
  params: Promise<{ country: string; state: string; city: string }>
}

export default function CityPageClient({ params }: CityPageClientProps) {
  const [cityData, setCityData] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stateName, setStateName] = useState<string>('')
  const [stateAbbr, setStateAbbr] = useState<string>('')
  const [cityName, setCityName] = useState<string>('')
  const [countryName, setCountryName] = useState<string>('')

  useEffect(() => {
    async function loadCityData() {
      try {
        setLoading(true)
        setError(null)
        
        // Get the names from async params
        const resolvedParams = await params
        const resolvedCountryName = resolvedParams.country
        const resolvedStateName = parseStateFromURL(resolvedParams.state)
        const resolvedCityName = parseCityFromURL(resolvedParams.city)
        const resolvedStateAbbr = await getStateAbbreviation(resolvedStateName)
        
        setCountryName(resolvedCountryName)
        setStateName(resolvedStateName)
        setStateAbbr(resolvedStateAbbr)
        setCityName(resolvedCityName)
        
        // Load escape rooms for this city and state
        const { data: roomsData, error: roomsError } = await getEscapeRoomsByCity(resolvedCityName, resolvedStateName, 50)
        if (roomsError) {
          throw new Error('Failed to load escape rooms')
        }
        
        // Format the data
        const formattedRooms = roomsData.map(formatRoomForDisplay)
        
        // Set city data
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

        setCityData({
          name: resolvedCityName,
          state: resolvedStateName,
          totalRooms: roomsData.length,
          image: getCountryImage(),
        })
        
        setRooms(formattedRooms)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    loadCityData()
  }, [params])

  // Generate structured data for the city page
  const generateStructuredData = () => {
    if (!cityData || !rooms.length) return null

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
              "item": "https://escaperoomsfinder.com"
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
              "name": countryName === 'usa' ? 'United States' : countryName === 'canada' ? 'Canada' : 'United Kingdom',
              "item": `https://escaperoomsfinder.com/locations/${countryName}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": stateName,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": `${cityName}, ${stateAbbr}`,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}/${formatStateForURL(cityName)}`
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": `Best Escape Rooms in ${cityName}, ${stateAbbr}`,
          "description": `Explore ${cityData.totalRooms} thrilling escape room adventures in ${cityName}, ${stateAbbr}. Find the best escape rooms with reviews, ratings, and booking information.`,
          "url": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}/${formatStateForURL(cityName)}`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": cityData.totalRooms,
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
                  "addressRegion": stateAbbr,
                  "addressCountry": countryName === 'usa' ? 'US' : countryName.toUpperCase()
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading {cityName}, {stateAbbr}</h1>
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
                    {countryName === 'usa' ? 'United States' : countryName === 'canada' ? 'Canada' : 'United Kingdom'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/locations/${countryName}/${formatStateForURL(stateName)}`}>
                    {stateName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{cityName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <section 
          className="relative text-white py-16 md:py-24 overflow-hidden" 
          style={{
            backgroundImage: 'url(/images/escape-room-city.jpg)',
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
                    href={`/locations/${countryName}/${formatStateForURL(stateName)}`}
                    className="text-escape-red hover:text-escape-red-600 transition-colors font-medium"
                  >
                    {stateName}
                  </Link>
                  <span className="text-gray-400">→</span>
                  <span className="text-white font-medium">{cityName}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
                  Best Escape Rooms in {cityName}, {stateAbbr}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                {loading ? (
                  <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
                ) : (
                  <>
                    Discover {cityData?.totalRooms || 0} thrilling escape room adventures in {cityName}, {stateAbbr}. From mind-bending puzzles to immersive storylines, find your next challenge.
                    <br className="hidden sm:block" />
                    <span className="text-escape-red-300">Unlock your next great adventure!</span>
                  </>
                )}
              </p>
              
              {/* Statistics */}
              {!loading && cityData && (
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                    <Building2 className="h-5 w-5 text-escape-red" />
                    <span className="font-semibold text-white">{cityData.totalRooms}</span>
                    <span className="text-gray-200">Escape Rooms</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                    <MapPin className="h-5 w-5 text-escape-red" />
                    <span className="font-semibold text-white">{cityName}</span>
                    <span className="text-gray-200">{stateAbbr}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                    <Star className="h-5 w-5 text-escape-red" />
                    <span className="font-semibold text-white">4.2+</span>
                    <span className="text-gray-200">Average Rating</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* All Escape Rooms */}
          <section>
            <h2 className="text-3xl font-bold mb-8">All Escape Rooms in {cityName}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No escape rooms found</h3>
                <p className="text-gray-600 mb-4">We couldn&apos;t find any escape rooms in {cityName}, {stateAbbr}</p>
                <Link href={`/locations/${countryName}/${formatStateForURL(stateName)}`}>
                  <Button variant="outline">
                    Explore other cities in {stateName}
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}