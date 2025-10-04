"use client"

import { useEffect, useState } from "react"
import { getFeaturedEscapeRooms, formatRoomForDisplay, type EscapeRoom } from "@/lib/supabase"
import EscapeRoomCard from "@/components/escape-room-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function FeaturedRooms() {
  const [featuredRooms, setFeaturedRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFeaturedRooms() {
      try {
        console.log('Fetching featured rooms...')
        const { data, error } = await getFeaturedEscapeRooms(3)
        
        console.log('Featured rooms response:', { data, error })
        
        if (error) {
          setError('Failed to load featured rooms')
          console.error('Error loading featured rooms:', error)
          return
        }

        if (!data || data.length === 0) {
          console.log('No featured rooms found')
          setError('No featured rooms available')
          return
        }

        const formattedRooms = data.map(formatRoomForDisplay)
        setFeaturedRooms(formattedRooms)
      } catch (err) {
        setError('Failed to load featured rooms')
        console.error('Error loading featured rooms:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedRooms()
  }, [])

  if (loading) {
    return (
      <section className="mb-12 relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-20 w-48 h-48 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-2">
                Featured Escape Rooms
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked adventures for the ultimate escape experience
              </p>
            </div>
            <Badge className="text-sm bg-gradient-to-r from-escape-red to-escape-red-600 text-white px-4 py-2">
              🏆 Top Rated
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300">
                <div className="bg-gray-300 h-48 w-full"></div>
                <CardHeader className="pb-2">
                  <div className="bg-gray-400 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-400 h-4 w-1/2 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-400 h-4 w-full rounded mb-2"></div>
                  <div className="bg-gray-400 h-4 w-2/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || featuredRooms.length === 0) {
    return (
      <section className="mb-12 relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-20 w-48 h-48 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-2">
                Featured Escape Rooms
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked adventures for the ultimate escape experience
              </p>
            </div>
            <Badge className="text-sm bg-gradient-to-r from-escape-red to-escape-red-600 text-white px-4 py-2">
              🏆 Top Rated
            </Badge>
          </div>
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              {error || 'No featured rooms available at the moment.'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for amazing escape room adventures!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-20 w-48 h-48 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Mystery elements */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-10 left-10 text-3xl animate-mystery-float pointer-events-none">🔍</div>
        <div className="absolute bottom-10 right-10 text-2xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-2">
              Featured Escape Rooms
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked adventures for the ultimate escape experience
            </p>
          </div>
          <Badge className="text-sm bg-gradient-to-r from-escape-red to-escape-red-600 text-white hover:from-escape-red-600 hover:to-escape-red-700 transition-all duration-300 shadow-lg hover:shadow-xl px-4 py-2">
            🏆 Top Rated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <div key={room.id} className="group relative">
              {/* Enhanced card with unique escape room styling */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-gray-900/30 to-black/40 rounded-2xl border border-escape-red/20 group-hover:border-escape-red/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-escape-red/20"></div>
              
              {/* Glowing effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-escape-red/5 to-escape-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Featured badge */}
              <div className="absolute -top-2 -right-2 z-20">
                <div className="bg-gradient-to-r from-escape-red to-escape-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  FEATURED #{index + 1}
                </div>
              </div>
              
              <div className="relative z-10 p-1">
                <EscapeRoomCard room={room} />
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-escape-red/30 group-hover:border-escape-red/60 transition-colors duration-300"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-escape-red/30 group-hover:border-escape-red/60 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
