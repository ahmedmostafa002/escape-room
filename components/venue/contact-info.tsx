import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Globe, Navigation, ExternalLink } from "lucide-react"
import Link from "next/link"
import VenueMap from "./venue-map"

interface ContactInfoProps {
  fullAddress?: string
  latitude?: number
  longitude?: number
  venueName: string
  phone?: string
  website?: string
  mapsUrl: string
}

export default function ContactInfo({ 
  fullAddress, 
  latitude, 
  longitude, 
  venueName, 
  phone, 
  website, 
  mapsUrl 
}: ContactInfoProps) {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fullAddress && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-600">{fullAddress}</p>
              </div>
            </div>
            
            {/* Interactive Map */}
            <VenueMap
              latitude={latitude || 0}
              longitude={longitude || 0}
              venueName={venueName}
              address={fullAddress || ''}
            />
            
            {/* External Maps Link */}
            <div className="mt-3">
              <Link
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-escape-red hover:bg-escape-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Navigation className="h-4 w-4" />
                View on Google Maps
              </Link>
            </div>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Phone</p>
              <Link
                href={`tel:${phone}`}
                className="text-escape-red hover:text-escape-red-600 text-sm"
              >
                {phone}
              </Link>
            </div>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Website</p>
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-escape-red hover:text-escape-red-600 text-sm inline-flex items-center gap-1"
              >
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
