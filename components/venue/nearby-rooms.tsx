import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NearbyRoom {
  id: string
  name: string
  city: string
  state: string
  photo?: string
  rating?: string
}

interface NearbyRoomsProps {
  nearbyRooms: NearbyRoom[]
  currentRoomId: string
  country: string
  state: string
  city: string
  formatVenueForURL: (name: string) => string
  formatCityForURL: (name: string) => string
}

export default function NearbyRooms({ 
  nearbyRooms, 
  currentRoomId, 
  country, 
  state, 
  city, 
  formatVenueForURL, 
  formatCityForURL 
}: NearbyRoomsProps) {
  if (!nearbyRooms || nearbyRooms.length === 0) return null

  const filteredRooms = nearbyRooms.filter(room => room.id !== currentRoomId).slice(0, 5)

  if (filteredRooms.length === 0) return null

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          Nearby Escape Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredRooms.map((room, index) => {
            const roomSlug = formatVenueForURL(room.name)
            const citySlug = formatCityForURL(room.city)
            return (
              <Link
                key={`${room.id}-${index}`}
                href={`/locations/${country}/${state}/${citySlug}/${roomSlug}`}
                className="block p-3 rounded-lg border border-gray-100 hover:border-escape-red/30 hover:bg-escape-red/5 transition-all duration-200"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={room.photo || '/placeholder.jpg'}
                      alt={room.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 mb-1 truncate">{room.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {room.city}, {room.state}
                    </div>
                    {room.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{parseFloat(room.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}