'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatVenueForURL, formatCityForURL, formatStateForURL, EscapeRoom } from '@/lib/supabase';

interface BlogSidebarProps {
  nearbyEscapeRooms: {
    id: string;
    name: string;
    location: string;
    rating: number;
    difficulty: string;
    duration: string;
    players: string;
    image: string;
    city?: string;
    state?: string;
    venue_name?: string;
  }[];
}

export default function BlogSidebar({ nearbyEscapeRooms }: BlogSidebarProps) {
  return (
    <div className="space-y-8">

      {/* Nearby Escape Rooms - Escape Room Themed */}
      <Card className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-escape-red/10 via-escape-red/5 to-escape-red/10 border-b border-escape-red/20 p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-escape-red/20 rounded-full flex items-center justify-center">
              <span className="text-escape-red text-sm md:text-lg">🗝️</span>
            </div>
            Nearby Escape Rooms
          </CardTitle>
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">Discover thrilling adventures near you</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
          {nearbyEscapeRooms.length > 0 ? (
            nearbyEscapeRooms.map((room) => {
              // Generate proper venue URL
              const getVenueUrl = () => {
                const countrySlug = 'united-states'
                const stateSlug = formatStateForURL(room.state || '')
                const citySlug = formatCityForURL(room.city || '')
                const venueSlug = formatVenueForURL(room.name || '')
                return `/locations/${countrySlug}/${stateSlug}/${citySlug}/${venueSlug}`
              }
              
              return (
              <Link key={room.id} href={getVenueUrl()} className="block group">
                <div className="p-3 md:p-4 rounded-xl border border-escape-red/10 hover:border-escape-red/30 hover:bg-gradient-to-r hover:from-escape-red/5 hover:to-escape-red/10 transition-all duration-300 relative overflow-hidden">
                  {/* Atmospheric background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-escape-red/10 rounded-full blur-sm"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 md:w-6 md:h-6 bg-escape-red-600/10 rounded-full blur-sm"></div>
                  </div>
                  
                  <div className="flex gap-3 md:gap-4 relative z-10">
                    <div className="flex-shrink-0">
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={room.image}
                          alt={`${room.name} Escape Room in ${room.city}, ${room.state}`}
                          width={80}
                          height={60}
                          className="w-16 h-12 md:w-20 md:h-15 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-gray-900 group-hover:text-escape-red mb-1 md:mb-2 transition-colors duration-300 line-clamp-2">
                        {room.name}
                      </h4>
                      <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                        <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-escape-red" />
                        <span className="text-xs text-gray-600 font-medium">{room.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-bold text-amber-700">{room.rating}</span>
                        </div>
                        <Badge className="text-xs bg-escape-red/10 text-escape-red border-escape-red/20 hover:bg-escape-red/20 transition-colors duration-300">
                          {room.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-escape-red-600" />
                          <span className="font-medium">{room.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 md:w-3 md:h-3 text-escape-red-600" />
                          <span className="font-medium">{room.players}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )})
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-escape-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-gray-500 text-sm">No nearby escape rooms found.</p>
              <p className="text-gray-400 text-xs mt-1">Check back later for new locations!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Signup - Escape Room Themed */}
      <Card className="bg-gradient-to-br from-escape-red via-escape-red-600 to-escape-red-700 text-white shadow-2xl rounded-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
        {/* Atmospheric elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>
        
        <CardHeader className="relative z-10 p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm md:text-lg">📧</span>
            </div>
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 p-4 md:p-6 pt-0">
          <p className="text-xs md:text-sm mb-4 md:mb-6 text-white/90 leading-relaxed">
            Get the latest escape room tips, reviews, and exclusive content delivered to your inbox. Join our community of puzzle enthusiasts!
          </p>
          <Button 
            variant="secondary" 
            className="w-full bg-white text-escape-red hover:bg-gray-100 font-bold py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn text-sm md:text-base"
          >
            <span className="group-hover/btn:scale-105 transition-transform duration-300">Subscribe Now</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}