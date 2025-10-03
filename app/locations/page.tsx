import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, Globe } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import Image from "next/image"
import { getCountryStats } from '@/lib/supabase'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Escape Rooms By Country | Find Escape Room Adventures Worldwide',
  description: 'Discover escape rooms around the world. Browse by country to find the best escape room experiences with detailed reviews and ratings.',
  openGraph: {
    title: 'Escape Rooms By Country | Find Escape Room Adventures Worldwide',
    description: 'Discover escape rooms around the world. Browse by country to find the best escape room experiences with detailed reviews and ratings.',
    type: 'website',
    url: 'https://escaperoomsfinder.com/locations',
  },
  alternates: {
    canonical: 'https://escaperoomsfinder.com/locations'
  }
}

// Define available countries with their metadata
const COUNTRIES = [
  {
    code: 'usa',
    name: 'United States',
    description: 'Discover thousands of escape rooms across all 50 states',
    image: '/images/united states.jpg',
    available: true
  },
  {
    code: 'canada',
    name: 'Canada',
    description: 'Explore escape rooms from coast to coast in Canada',
    image: '/images/canada.jpg',
    available: false // Will be available soon
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    description: 'Find amazing escape room experiences across the UK',
    image: '/images/united kingdom.jpg',
    available: false // Will be available soon
  }
];

export default async function LocationsPage() {
  // Fetch country statistics
  const { data: countryStats, error } = await getCountryStats()
  
  // Find USA stats with better matching
  const usaStats = countryStats?.find(country => {
    const countryName = country.country?.toLowerCase().trim()
    return countryName === 'usa' || 
           countryName === 'united states' ||
           countryName === 'us' ||
           countryName === 'america'
  })
  
  // Log for debugging
  if (!usaStats && countryStats) {
    console.log('Available countries:', countryStats.map(c => c.country))
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
                <BreadcrumbPage>Escape Rooms By Country</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 overflow-hidden" 
        style={{
          backgroundImage: 'url(/images/escape-room-location.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
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
              <Globe className="h-8 w-8 text-escape-red" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Escape Rooms Worldwide
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover amazing escape rooms around the globe. Choose your country to start exploring unique escape room experiences worldwide.
              <br className="hidden sm:block" />
              <span className="text-escape-red-300">Unlock your next great adventure!</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Country</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a country below to discover escape rooms in your region. More countries are being added regularly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {COUNTRIES.map((country) => (
            <Card key={country.code} className={`overflow-hidden transition-all duration-300 p-0 ${
              country.available 
                ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                : 'opacity-75 cursor-not-allowed'
            }`}>
              <div className="relative m-0 p-0 h-48">
                <Image 
                  src={country.image} 
                  alt={`Escape Rooms in ${country.name} - Discover amazing escape room experiences`} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover" 
                  {...(country.code === 'usa' ? { priority: true } : { loading: 'lazy' })}
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`text-lg ${
                    country.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {country.available ? 'Available' : 'Coming Soon'}
                  </Badge>
                </div>

              </div>

              <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                  <Globe className="h-5 w-5 text-escape-red" />
                  {country.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {country.description}
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                {country.available ? (
                  <Link href={`/locations/${country.code}`}>
                    <div className="w-full bg-escape-red hover:bg-escape-red-600 text-white py-3 px-4 rounded-md text-center transition-colors font-medium">
                      Explore {country.name}
                    </div>
                  </Link>
                ) : (
                  <div className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-md text-center font-medium">
                    Coming Q2 2025
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </div>
  )
}
