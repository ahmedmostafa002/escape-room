import { Star, MapPin } from "lucide-react"
import Image from "next/image"

interface VenueHeroProps {
  name: string
  city: string
  state: string
  photo?: string
  rating?: string
  reviewCount?: number
}

export default function VenueHero({ 
  name, 
  city, 
  state, 
  photo, 
  rating, 
  reviewCount 
}: VenueHeroProps) {
  return (
    <div className="relative h-96 overflow-hidden">
      {photo ? (
        <div className="absolute inset-0">
          <Image 
            src={photo} 
            alt={name}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-escape-red to-escape-red-700" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Enhanced atmospheric elements matching homepage */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-escape-red rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-escape-red-600 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      
      {/* Mystery elements */}
      <div className="absolute inset-0 opacity-10 -z-20">
        <div className="absolute top-1/4 right-1/6 text-2xl animate-mystery-float pointer-events-none select-none">🔍</div>
        <div className="absolute bottom-1/4 left-1/6 text-xl animate-mystery-float delay-1000 pointer-events-none select-none">🗝️</div>
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center z-10">
        <div className="text-white relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent relative z-30">
            {name}
          </h1>
          <div className="flex items-center gap-2 text-lg relative z-30">
            <MapPin className="h-5 w-5" />
            <span>{city}, {state}</span>
          </div>
          {rating && (
            <div className="flex items-center gap-2 mt-2 relative z-30">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(parseFloat(rating))
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg">{parseFloat(rating).toFixed(1)}</span>
              {reviewCount && (
                <span className="text-sm opacity-90">({reviewCount} reviews)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
