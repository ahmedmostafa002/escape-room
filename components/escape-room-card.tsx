"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Heart, Eye, Ticket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatStateForURL, formatCityForURL, formatVenueForURL } from "@/lib/supabase"

// Use the formatted room type that includes display properties
interface FormattedEscapeRoom {
  id: string
  name: string
  location: string
  rating: number | null
  reviews: number
  duration: number
  players: string
  theme: string
  difficulty: string
  image: string
  city: string
  state: string
  venue_name: string
  order_links?: string
  website?: string
}

interface EscapeRoomCardProps {
  room: FormattedEscapeRoom
}

export default function EscapeRoomCard({ room }: EscapeRoomCardProps) {
  // Generate venue-specific URL - all rooms now have complete venue data
  const getVenueUrl = () => {
    const countrySlug = 'united-states' // Default to US for now
    const stateSlug = formatStateForURL(room.state!)
    const citySlug = formatCityForURL(room.city!)
    const venueSlug = formatVenueForURL(room.venue_name!)
    return `/locations/${countrySlug}/${stateSlug}/${citySlug}/${venueSlug}`
  }

  const hasOrderLinks = room.order_links && room.order_links.trim() !== '';

  const formatUrl = (url: string) => {
    if (!url || url === '#') return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  }

  return (
    <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl border-0">
      {/* Clean, modern card design */}
      <div className="relative h-[400px]">
        
        {/* Beautiful image section */}
        <Link href={getVenueUrl()}>
          <div className="relative h-[250px] overflow-hidden rounded-t-2xl">
            <Image
              src={room.image || "/placeholder.svg"}
              alt={`${room.name} Escape Room in ${room.city}, ${room.state}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/placeholder.svg')) {
                  target.src = '/placeholder.svg';
                  target.srcset = '/placeholder.svg';
                }
              }}
              priority={false}
              loading="lazy"
              unoptimized={room.image?.includes('googleusercontent.com')}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Heart button */}
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-4 right-4 bg-white/90 hover:bg-escape-red hover:text-white transition-all duration-300 shadow-lg rounded-full w-10 h-10 p-0 z-20"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            {/* Difficulty badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge
                className={`${
                  room.difficulty?.toLowerCase().includes('beginner') || room.difficulty?.toLowerCase().includes('easy')
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : room.difficulty?.toLowerCase().includes('standard') || room.difficulty?.toLowerCase().includes('moderate') || room.difficulty?.toLowerCase().includes('intermediate')
                      ? "bg-amber-500 hover:bg-amber-600"
                      : room.difficulty?.toLowerCase().includes('challenging') || room.difficulty?.toLowerCase().includes('advanced') || room.difficulty?.toLowerCase().includes('hard')
                        ? "bg-escape-red hover:bg-escape-red-600"
                        : "bg-gray-500 hover:bg-gray-600"
                } text-white border-0 shadow-lg font-semibold px-3 py-1 text-sm rounded-full transition-colors duration-300`}
              >
                {room.difficulty || 'Standard'}
              </Badge>
            </div>
            
            {/* Room title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">
                {room.name}
              </h3>
            </div>
          </div>
        </Link>
        
        {/* Clean content section */}
        <div className="p-4 bg-white">
          
          {/* Location and rating */}
          <div className="flex items-center justify-between mb-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="text-sm font-medium truncate">
                {room.city}, {room.state}
              </span>
            </div>
            
            {/* Rating */}
            {room.rating ? (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-amber-400 fill-current" />
                <span className="text-amber-700 font-semibold text-sm">
                  {room.rating.toFixed(1)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 font-semibold text-sm">
                  N/A
                </span>
              </div>
            )}
          </div>
          
          {/* Theme */}
          <div className="mb-4">
            <Badge className="bg-escape-red/10 text-escape-red border-escape-red/20 hover:bg-escape-red/20 transition-colors duration-300 px-3 py-1 text-sm font-medium">
              {room.theme || "Adventure"}
            </Badge>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Link href={getVenueUrl()} className="flex-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-9 border-escape-red/30 text-gray-700 hover:bg-escape-red hover:text-white hover:border-escape-red transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            {hasOrderLinks && (
              <Button 
                size="sm" 
                className="flex-1 h-9 bg-escape-red hover:bg-escape-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(formatUrl(room.order_links!), '_blank');
                }}
              >
                <Ticket className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
