"use client"

import { useEffect, useState } from "react"
import { Users, MapPin, Star, Clock, Trophy, Heart } from "lucide-react"
import { getDatabaseStats } from '@/lib/supabase'

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      icon: MapPin,
      label: "Escape Rooms",
      value: "Loading...",
      color: "from-[#1a1f2e] to-[#232937]",
      description: "Verified locations",
    },
    {
      icon: Users,
      label: "Cities Covered",
      value: "Loading...",
      color: "from-[#00d4aa] to-[#1dd1a1]",
      description: "Across all 50 states",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "Loading...",
      color: "from-orange-500 to-orange-600",
      description: "From verified reviews",
    },
    {
      icon: Clock,
      label: "Hours of Fun",
      value: "Loading...",
      color: "from-black to-gray-800",
      description: "Adventure time logged",
    },
    {
      icon: Trophy,
      label: "Success Rate",
      value: "67%",
      color: "from-orange-500 to-orange-600",
      description: "Teams that escape",
    },
    {
      icon: Heart,
      label: "Happy Customers",
      value: "50K+",
      color: "from-pink-600 to-pink-700",
      description: "5-star experiences",
    },
  ])

  useEffect(() => {
    setIsVisible(true)
    
    async function loadStats() {
      if (!isLoading) return // Prevent multiple calls
      
      try {
        const data = await getDatabaseStats()
        
        if (!data) {
          console.error('Error loading stats: No data returned')
          setIsLoading(false)
          return
        }

        const totalHours = Math.round((data.totalRooms * 60) / 1000) // Estimate based on 60min avg per room
        
        setStats([
          {
            icon: MapPin,
            label: "Escape Rooms",
            value: `${data.totalRooms.toLocaleString()}+`,
            color: "from-escape-red to-escape-red-700",
            description: "Verified locations",
          },
          {
            icon: Users,
            label: "Cities Covered",
            value: `${data.uniqueCities}+`,
            color: "from-escape-red-600 to-escape-red-800",
            description: "Across all 50 states",
          },
          {
            icon: Star,
            label: "Average Rating",
            value: data.averageRating.toFixed(1),
            color: "from-orange-500 to-orange-600",
            description: "From verified reviews",
          },
          {
            icon: Clock,
            label: "Hours of Fun",
            value: `${totalHours}K+`,
            color: "from-gray-700 to-gray-900",
            description: "Adventure time logged",
          },
          {
            icon: Trophy,
            label: "Success Rate",
            value: "67%",
            color: "from-yellow-500 to-yellow-600",
            description: "Teams that escape",
          },
          {
            icon: Heart,
            label: "Happy Customers",
            value: "50K+",
            color: "from-escape-red-500 to-escape-red-600",
            description: "5-star experiences",
          },
        ])
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading stats:', err)
        setIsLoading(false)
      }
    }

    loadStats()
  }, [isLoading])

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-72 h-72 bg-escape-red rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-escape-red-700 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Enhanced floating mystery elements with more visibility */}
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-1/4 left-1/6 text-8xl animate-mystery-float pointer-events-none drop-shadow-2xl">🔍</div>
        <div className="absolute top-3/4 right-1/5 text-7xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">🗝️</div>
        <div className="absolute top-1/2 left-3/4 text-6xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">🔐</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">⏱️</div>
        <div className="absolute top-1/6 right-1/4 text-4xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">🧩</div>
        <div className="absolute bottom-1/6 left-1/3 text-5xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🎯</div>
      </div>

      {/* Additional geometric background elements */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/40 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/40 rounded-full animate-spin-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/40 rounded-full animate-spin-slow delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/40 rounded-full animate-spin-slow delay-1500"></div>
      </div>

      {/* Glowing accent lines */}
      <div className="absolute inset-0 opacity-25 z-0">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/60 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/60 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/60 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-escape-red via-white to-escape-red-600 bg-clip-text text-transparent">
            Trusted by Adventure Seekers
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join millions of escape room enthusiasts who trust Escape Rooms Finder to discover their next thrilling adventure.
            <br className="hidden sm:block" />
            <span className="text-escape-red-300">Your next great escape awaits!</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group hover:scale-105 transition-all duration-500 relative ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card background with glass effect */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-escape-red/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-escape-red/20"></div>
              
              <div className="relative p-4">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow relative z-10`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-escape-red-200 transition-colors duration-300">{stat.value}</div>
                <div className="text-gray-300 font-medium mb-1 group-hover:text-white transition-colors duration-300 text-sm">{stat.label}</div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
