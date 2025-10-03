import { getEscapeRoomByVenue, getRoomAmenities, getRoomBusinessHours, parseStateFromURL, parseCityFromURL, parseVenueFromURL, getNearbyCities, getNearbyRooms, formatVenueForURL, formatCityForURL, supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { ReviewsSection } from "@/components/reviews/reviews-section"
import { createVenueMetadata } from "@/lib/metadata"
import VenueHero from "@/components/venue/venue-hero"
import VenueDescription from "@/components/venue/venue-description"
import VenueFeatures from "@/components/venue/venue-features"
import VenueDetails from "@/components/venue/venue-details"
import ContactInfo from "@/components/venue/contact-info"
import BusinessHours from "@/components/venue/business-hours"
import NearbyRooms from "@/components/venue/nearby-rooms"
import NearbyCities from "@/components/venue/nearby-cities"

// Helper function to convert URL country format to page route format
function getCountryRouteFromURL(urlCountry: string): string {
  const countryMapping: Record<string, string> = {
    'united-states': 'usa',
    'canada': 'canada',
    'united-kingdom': 'uk'
  }
  return countryMapping[urlCountry] || urlCountry
}




export default async function VenueDetailPage({ 
  params 
}: { 
  params: Promise<{ country: string; state: string; city: string; venue: string }> 
}) {
  // Await params in Next.js 15
  const { country, state, city, venue } = await params
  
  // Parse URL-friendly parameters back to readable format
  const stateName = parseStateFromURL(state)
  const cityName = parseCityFromURL(city)
  const venueName = parseVenueFromURL(venue)
  const countryRoute = getCountryRouteFromURL(country)
  
  // Fetch real data from Supabase using venue name, city, and state
  const { data: room, error } = await getEscapeRoomByVenue(venueName, cityName, stateName)
  
  if (error || !room) {
    notFound()
  }
  
  // Fetch additional room data using the room ID
  const amenities = await getRoomAmenities(room.id)
  const businessHours = await getRoomBusinessHours(room.id)
  const nearbyCities = await getNearbyCities(stateName)
  const { data: nearbyRooms } = await getNearbyRooms(room.id, cityName, stateName)

  // Helper function to format time with AM/PM
  const formatTime = (timeStr: string): string => {
    if (!timeStr || timeStr === 'Closed') return timeStr
    
    // If already has AM/PM, return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr
    }
    
    // Handle 24-hour format (HH:MM:SS or HH:MM)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2]
      const period = hours >= 12 ? 'PM' : 'AM'
      
      if (hours === 0) hours = 12
      else if (hours > 12) hours -= 12
      
      return `${hours}:${minutes} ${period}`
    }
    
    // Handle simple hour format (e.g., "9", "12")
    const hourMatch = timeStr.match(/^(\d{1,2})$/)
    if (hourMatch) {
      let hours = parseInt(hourMatch[1])
      const period = hours >= 12 ? 'PM' : 'AM'
      
      if (hours === 0) hours = 12
      else if (hours > 12) hours -= 12
      
      return `${hours}:00 ${period}`
    }
    
    return timeStr
  }

  // Parse working hours from JSON field or use business_hours table
  let schedule: { day: string; hours: string }[] = []
  if (room.working_hours) {
    try {
      const workingHours = JSON.parse(room.working_hours)
      schedule = Object.entries(workingHours).map(([day, hours]) => {
        if (hours === 'Closed' || !hours) {
          return { day, hours: 'Closed' }
        }
        
        // Handle range format like "12-9:30PM" or "9AM-5PM"
        const rangeMatch = (hours as string).match(/^([^-]+)-(.+)$/)
        if (rangeMatch) {
          const openTime = formatTime(rangeMatch[1].trim())
          const closeTime = formatTime(rangeMatch[2].trim())
          return { day, hours: `${openTime} - ${closeTime}` }
        }
        
        return { day, hours: formatTime(hours as string) }
      })
    } catch (e) {
      console.error('Error parsing working hours:', e)
    }
  }
  
  // Fallback to business_hours table if working_hours is not available
  if (schedule.length === 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    schedule = dayNames.map((dayName, index) => {
      const dayHours = businessHours?.find(h => h?.day_of_week === index)
      if (!dayHours || dayHours.is_closed) {
        return { day: dayName, hours: 'Closed' }
      }
      
      const openTime = formatTime(dayHours.open_time || '9:00')
      const closeTime = formatTime(dayHours.close_time || '21:00')
      
      return {
        day: dayName,
        hours: `${openTime} - ${closeTime}`
      }
    })
  }

  // Extract features from amenities and group by category
  const amenitiesByCategory = amenities?.reduce((acc, amenity) => {
    const category = amenity?.amenity_category || 'general'
    if (!acc[category]) acc[category] = []
    if (amenity?.amenity_name && amenity.is_available) {
      acc[category].push(amenity.amenity_name)
    }
    return acc
  }, {} as Record<string, string[]>) || {}
  
  const allFeatures = Object.values(amenitiesByCategory).flat()
  
  // Google Maps URL for location - use check_url from database if available
  const mapsUrl = room.check_url || 
    (room.latitude && room.longitude 
      ? `https://www.google.com/maps?q=${room.latitude},${room.longitude}`
      : `https://www.google.com/maps/search/${encodeURIComponent(room.full_address || (room.name + ' ' + room.city + ' ' + room.state))}`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <VenueHero
        name={room.name}
        city={room.city}
        state={room.state}
        photo={room.photo}
        rating={room.rating}
        reviewCount={room.review_count}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <VenueDescription
              description={room.description}
              postContent={room.post_content}
            />

            {/* Features */}
            <VenueFeatures features={allFeatures as string[]} />

            {/* Reviews Section */}
            <ReviewsSection roomId={room.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Venue Details */}
            <VenueDetails
              difficulty={room.difficulty}
              teamSize={room.team_size}
              duration={room.duration}
              price={room.price}
              orderLinks={room.order_links}
            />

            {/* Contact Information */}
            <ContactInfo
              fullAddress={room.full_address}
              latitude={room.latitude}
              longitude={room.longitude}
              venueName={room.name}
              phone={room.phone}
              website={room.website}
              mapsUrl={mapsUrl}
            />

            {/* Business Hours */}
            <BusinessHours schedule={schedule} />

            {/* Nearby Escape Rooms */}
            <NearbyRooms
              nearbyRooms={nearbyRooms || []}
              currentRoomId={room.id}
              country={country}
              state={state}
              city={city}
              formatVenueForURL={formatVenueForURL}
              formatCityForURL={formatCityForURL}
            />

            {/* Nearby Cities */}
            <NearbyCities
              nearbyCities={nearbyCities || []}
              currentCity={room.city}
              country={country}
              state={state}
              formatCityForURL={formatCityForURL}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Function to get state abbreviation from database
async function getStateAbbreviation(stateName: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('geographic_regions')
      .select('code')
      .eq('type', 'state')
      .ilike('name', stateName)
      .single()
    
    if (error || !data) {
      // Fallback to first two letters if not found
      return stateName.toUpperCase().substring(0, 2)
    }
    
    return data.code
  } catch (err) {
    // Fallback to first two letters if error
    return stateName.toUpperCase().substring(0, 2)
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ country: string; state: string; city: string; venue: string }> 
}): Promise<Metadata> {
  const { country, state, city, venue } = await params
  
  const stateName = parseStateFromURL(state)
  const cityName = parseCityFromURL(city)
  const venueName = parseVenueFromURL(venue)
  
  const { data: room } = await getEscapeRoomByVenue(venueName, cityName, stateName)
  
  if (!room) {
    return {
      title: 'Escape Room Not Found | Escape Rooms Finder',
      description: 'The requested escape room could not be found. Browse other escape rooms in your area.',
      robots: {
        index: false,
        follow: true
      }
    }
  }
  
  // Get state abbreviation from database
  const stateAbbr = await getStateAbbreviation(stateName)
  
  const description = room.description || `Experience ${room.name}, an exciting escape room located in ${cityName}, ${stateName}.`
  const rating = room.rating ? parseFloat(room.rating) : undefined
  
  return createVenueMetadata(
    room.name,
    cityName,
    stateName,
    description,
    rating,
    stateAbbr
  )
}
