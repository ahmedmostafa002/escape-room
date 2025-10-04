"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import EscapeRoomCard from "@/components/escape-room-card"
import Link from "next/link"
import { supabase, formatRoomForDisplay } from "@/lib/supabase"

interface EscapeRoom {
  id: string
  name: string
  city: string
  state: string
  rating: number
  category_new: string
  difficulty: string
  order_links: string
  photo: string
  full_address: string
}

export default function HomepageEscapeRooms() {
  const [rooms, setRooms] = useState<EscapeRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from('escape_rooms')
          .select('id, name, city, state, rating, category_new, photo, full_address, difficulty, order_links')
          .limit(12)
          .order('rating', { ascending: false })

        if (error) {
          console.error('Error fetching rooms:', error)
          return
        }

        setRooms(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return (
      <section className="relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Mystery elements */}
        <div className="absolute inset-0 opacity-5 -z-10">
          <div className="absolute top-10 left-10 text-4xl animate-mystery-float pointer-events-none">🔍</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
          <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500 pointer-events-none">🔐</div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-2">
                Discover All Escape Rooms
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our complete collection of thrilling adventures
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              Loading amazing adventures...
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
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

  return (
    <section className="relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Mystery elements */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-10 left-10 text-4xl animate-mystery-float pointer-events-none">🔍</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
        <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500 pointer-events-none">🔐</div>
        <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500 pointer-events-none">⏱️</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-2">
              Discover All Escape Rooms
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our complete collection of thrilling adventures
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            Showing 1-{rooms.length} of {rooms.length} rooms
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {rooms.map((room, index) => (
            <div key={room.id} className="group relative">
              {/* Enhanced card wrapper with escape room atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-gray-900/10 to-black/15 rounded-2xl border border-gray-200/50 group-hover:border-escape-red/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-escape-red/10"></div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-escape-red/2 to-escape-red-600/2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Enhanced room number badge with better visibility */}
              <div className="absolute -top-4 -left-0 z-30">
                <div className="relative">
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-escape-red rounded-full blur-sm animate-pulse"></div>
                  {/* Main badge */}
                  <div className="relative bg-gradient-to-br from-escape-red to-escape-red-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shadow-2xl border-4 border-white/90 hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
                </div>
              </div>
              
              <div className="relative z-10 p-1">
                <EscapeRoomCard room={formatRoomForDisplay(room)} />
              </div>
              
              {/* Corner accent lines */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-escape-red/20 group-hover:border-escape-red/40 transition-colors duration-300"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-escape-red/20 group-hover:border-escape-red/40 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/browse">
            <Button size="lg" className="px-12 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              {/* Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10">🚪 Browse All Escape Rooms</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}