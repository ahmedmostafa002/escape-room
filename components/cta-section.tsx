"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Clock } from "lucide-react"
import Link from "next/link"
import { getDatabaseStats } from '@/lib/supabase'

export default function CTASection() {
  const [stats, setStats] = useState({ totalRooms: 0, uniqueCities: 0, averageRating: 0, happyUsers: 50000 })

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDatabaseStats()
        if (data) {
          setStats({
            totalRooms: data.totalRooms,
            uniqueCities: data.uniqueCities,
            averageRating: data.averageRating,
            happyUsers: Math.round(data.totalRooms * 20) // Estimate 20 users per room
          })
        }
      } catch (error) {
        console.error('Error loading CTA stats:', error)
      }
    }
    loadStats()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Enhanced atmospheric background to match theme section */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 bg-escape-red rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-escape-red-700 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Enhanced floating mystery elements with more visibility */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 text-8xl animate-mystery-float drop-shadow-2xl">🏆</div>
        <div className="absolute top-3/4 right-1/5 text-7xl animate-mystery-float delay-1000 drop-shadow-2xl">🎯</div>
        <div className="absolute top-1/2 left-3/4 text-6xl animate-mystery-float delay-500 drop-shadow-2xl">🚀</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl animate-mystery-float delay-1500 drop-shadow-2xl">⭐</div>
        <div className="absolute top-1/6 right-1/4 text-4xl animate-mystery-float delay-2000 drop-shadow-2xl">🎪</div>
        <div className="absolute bottom-1/6 left-1/3 text-5xl animate-mystery-float delay-2500 drop-shadow-2xl">🎨</div>
      </div>

      {/* Additional geometric background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
      </div>

      {/* Glowing accent lines */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">Ready for Your Next Adventure?</h2>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              Join thousands of escape room enthusiasts who trust Escape Rooms Finder to discover their perfect adventure. 
              <br className="hidden sm:block" />
              <span className="text-escape-red-300">Start exploring today and create unforgettable memories!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/browse">
                <Button size="lg">
                  Start Exploring
                </Button>
              </Link>
              <Link href="/add-listing">
                <Button variant="outline" size="lg">
                  List Your Room
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 text-white/90">
              <div className="flex items-center gap-2 hover:text-escape-red transition-colors">
                <Zap className="h-5 w-5 text-escape-red" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center gap-2 hover:text-escape-red-600 transition-colors">
                <Users className="h-5 w-5 text-escape-red-600" />
                <span>Group Friendly</span>
              </div>
              <div className="flex items-center gap-2 hover:text-escape-red-700 transition-colors">
                <Clock className="h-5 w-5 text-escape-red-700" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-escape-red/20 to-escape-red-700/10 backdrop-blur-sm border-escape-red/30 text-white hover:from-escape-red/30 hover:to-escape-red-700/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2 text-escape-red">{stats.totalRooms.toLocaleString()}+</div>
                <div className="text-white/90">Escape Rooms</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-escape-red-600/20 to-escape-red-800/10 backdrop-blur-sm border-escape-red-600/30 text-white hover:from-escape-red-600/30 hover:to-escape-red-800/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2 text-escape-red-600">{stats.uniqueCities}+</div>
                <div className="text-white/90">Cities</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-escape-red-700/20 to-escape-red-900/10 backdrop-blur-sm border-escape-red-700/30 text-white hover:from-escape-red-700/30 hover:to-escape-red-900/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2 text-escape-red-700">{stats.averageRating.toFixed(1)}★</div>
                <div className="text-white/90">Average Rating</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-escape-red-500/20 to-escape-red-600/10 backdrop-blur-sm border-escape-red-500/30 text-white hover:from-escape-red-500/30 hover:to-escape-red-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2 text-escape-red-500">{Math.round(stats.happyUsers / 1000)}K+</div>
                <div className="text-white/90">Happy Users</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
