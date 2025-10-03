"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star } from "lucide-react"

import { getCitiesWithCounts, getDatabaseStats, supabase } from '@/lib/supabase'

export default function HeroSection() {
  // SEO-optimized heading text
  const mainHeading = (
    <>
      <div className="text-4xl sm:text-6xl font-bold text-white">
        Find Your Next
      </div>
      <div className="text-4xl sm:text-6xl font-bold">
        <span className="text-escape-red">Escape Room</span>
      </div>
      <div className="text-4xl sm:text-6xl font-bold text-white">
        Adventure Near You
      </div>
    </>
  )
  const backgroundStyle = {
    backgroundImage: 'url(/images/hero.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
  const [location, setLocation] = useState("")
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<{state?: string, fullName: string, abbreviation: string, room_count?: number, city_count?: number}[]>([])
  const [cities, setCities] = useState<Array<{city: string, state: string, count?: number}>>([])
  const [stats, setStats] = useState({ totalRooms: 2500, uniqueCities: 500, averageRating: 4.8 })
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{type: 'city' | 'state' | 'postal', value: string, display: string}>>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const router = useRouter()

  // Load stats on component mount
  useEffect(() => {
    async function loadData() {
      // Load real database statistics
      const statsData = await getDatabaseStats()
      setStats({
        totalRooms: statsData.totalRooms,
        uniqueCities: statsData.uniqueCities,
        averageRating: statsData.averageRating
      })
      
      // Load countries
      await loadCountries()
    }
    loadData()
  }, [])

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('country')
        .not('country', 'is', null)
      
      if (error) throw error
      
      const uniqueCountries = [...new Set(data.map(item => item.country))].sort()
      setCountries(uniqueCountries)
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const loadStatesForCountry = async (country: string) => {
    try {
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('state')
        .eq('country', country)
        .not('state', 'is', null)
      
      if (error) throw error
      
      const uniqueStates = [...new Set(data.map(item => item.state))]
        .sort()
        .map(state => ({ fullName: state, abbreviation: state }))
      
      setStates(uniqueStates)
    } catch (error) {
      console.error('Error loading states:', error)
    }
  }

  const loadCitiesForState = async (state: string) => {
    try {
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('city')
        .eq('state', state)
        .not('city', 'is', null)
      
      if (error) throw error
      
      const cityMap = new Map()
      data.forEach(item => {
        if ('city' in item && 'state' in item && item.city && item.state) {
          const key = `${item.city}-${item.state}`
          if (!cityMap.has(key)) {
            cityMap.set(key, { city: item.city, state: item.state })
          }
        }
      })
      const uniqueCities = Array.from(cityMap.values())
        .sort((a, b) => a.city.localeCompare(b.city))
      setCities(uniqueCities)
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }



  // Handle location suggestions
  const handleLocationInput = async (value: string) => {
    setLocation(value)
    if (value.length >= 2) {
      const suggestions: Array<{type: 'city' | 'state' | 'postal', value: string, display: string}> = []
      
      // Check if input looks like a postal code (5 digits or 5+4 format)
      const isPostalCode = /^\d{1,5}(-\d{0,4})?$/.test(value)
      
      if (isPostalCode) {
        // For postal codes, query the database directly for better performance
        try {
          const { data: rooms, error } = await supabase
            .from('escape_rooms')
            .select('postal_code, city, state')
            .not('postal_code', 'is', null)
            .ilike('postal_code', `${value}%`)
            .limit(10)
          
          if (!error && rooms) {
            const uniquePostalCodes = new Set<string>()
            rooms.forEach(room => {
              if (room.postal_code) {
                uniquePostalCodes.add(room.postal_code)
              }
            })
            
            Array.from(uniquePostalCodes).slice(0, 5).forEach(postal => {
              const roomWithPostal = rooms.find(r => r.postal_code === postal)
              suggestions.push({
                type: 'postal',
                value: postal,
                display: `${postal} - ${roomWithPostal?.city}, ${roomWithPostal?.state}`
              })
            })
          }
        } catch (error) {
          console.error('Error fetching postal codes:', error)
        }
      } else {
        // Add city suggestions
        const { data: cities } = await getCitiesWithCounts()
        const matchingCities = cities.filter(city => 
          city.city.toLowerCase().includes(value.toLowerCase()) ||
          city.state.toLowerCase().includes(value.toLowerCase()) ||
          `${city.city}, ${city.state}`.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5)
        
        matchingCities.forEach(city => {
          suggestions.push({
            type: 'city',
            value: `${city.city}, ${city.state}`,
            display: `${city.city}, ${city.state} (${city.count} rooms)`
          })
        })
      }
      
      setLocationSuggestions(suggestions)
      setShowLocationSuggestions(true)
    } else {
      setShowLocationSuggestions(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Location filters
    if (selectedCountry) {
      params.set('country', selectedCountry)
    }
    
    if (selectedState) {
      params.set('state', selectedState)
    }
    
    if (selectedCity) {
      params.set('city', selectedCity)
    }
    
    // Add location if provided
    if (location.trim()) {
      params.set('location', location.trim())
    }
    
    const queryString = params.toString()
    const url = queryString ? `/browse?${queryString}` : '/browse'
    router.push(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative w-full min-h-[60vh]" style={backgroundStyle} role="img" aria-label="Exciting escape room experience with players solving puzzles in an immersive environment">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
      
      {/* Enhanced atmospheric elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Enhanced floating mystery elements with more visibility */}
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
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500"></div>
      </div>
      
      <div className="relative z-10 py-16 md:py-40">
        <div className="container mx-auto px-4 text-center">
          {/* Main Title */}
          <header className="mb-6">
            <h1 className="space-y-2 mb-4">
              {mainHeading}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed">
              Discover the most thrilling escape rooms across the globe.
              <br className="hidden sm:block" />
              Explore adventure, mystery, fantasy, horror, and historical themed rooms.
            </p>
          </header>

        {/* Enhanced Search bar with escape room styling */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl border border-escape-red/20 relative">
            {/* Search bar atmospheric elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-16 h-16 bg-escape-red rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-escape-red-600 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <div className="flex-1 relative group">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="City, State, or ZIP code"
                  className="pl-12 h-14 bg-white text-black text-lg border-0 focus:ring-2 focus:ring-escape-red"
                  value={location}
                  onChange={(e) => handleLocationInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => location.length >= 2 && setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                />
                {/* Location Suggestions */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] mt-2 max-h-64 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-escape-red/10 text-black text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-200 hover:text-escape-red"
                        onClick={() => {
                          setLocation(suggestion.value)
                          setShowLocationSuggestions(false)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{suggestion.display}</span>
                          <span className="ml-2 text-xs text-escape-red/60 capitalize bg-escape-red/10 px-2 py-1 rounded-full">{suggestion.type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Now
              </Button>
            </div>
          </div>
        </div>

       

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
