import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface EscapeRoom {
  id: string
  name: string
  website?: string
  phone?: string
  full_address?: string
  city?: string
  country?: string
  postal_code?: string
  state?: string
  latitude?: number
  longitude?: number
  rating?: number
  reviews_average?: number
  photo?: string
  working_hours?: string
  description?: string
  order_links?: string
  check_url?: string
  status?: string
  post_content?: string
  category_new?: string
  difficulty?: string
  created_at?: string
  updated_at?: string
}

export interface RoomAmenity {
  id: string
  room_id: string
  amenity_name: string
  amenity_category?: string
  amenity_value?: string
  is_available?: boolean
  created_at?: string
}

export interface BusinessHours {
  id: string
  room_id: string
  day_of_week: number
  day_name: string
  open_time?: string
  close_time?: string
  is_closed?: boolean
  special_hours?: string
  created_at?: string
}

export interface GeographicRegion {
  id: string
  name: string
  type: 'country' | 'state' | 'city' | 'region' | 'county'
  parent_id?: string
  code?: string
  bounds?: { north: number; south: number; east: number; west: number }
  center_lat?: number
  center_lng?: number
  population?: number
  area_sq_miles?: number
  timezone?: string
  created_at?: string
}

export interface GeographicShape {
  id: string
  region_id: string
  entity_type: string
  entity_name: string
  geometry_type: string
  coordinates: number[] | number[][]
  properties?: Record<string, unknown>
  source?: string
  created_at?: string
  updated_at?: string
}

// Database query functions
export async function getEscapeRooms({
  limit = 20,
  offset = 0,
  name,
  city,
  state,
  country,
  category
}: {
  limit?: number
  offset?: number
  name?: string
  city?: string
  state?: string
  country?: string
  category?: string
} = {}) {
  let query = supabase
    .from('escape_rooms')
    .select('*', { count: 'exact' })
    .eq('status', 'Open')
    .order('rating', { ascending: false })

  if (name) {
    query = query.ilike('name', `%${name}%`)
  }

  if (city) {
    query = query.ilike('city', `%${city}%`)
  }
  
  if (state) {
    // Get both full state name and abbreviation for better matching
    const fullStateName = getFullStateName(state)
    const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()]
    
    if (stateAbbr) {
      // Use exact match for abbreviation and contains match for full name
      query = query.or(`state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`)
    } else {
      query = query.ilike('state', `%${state}%`)
    }
  }
  
  if (country) {
    query = query.ilike('country', `%${country}%`)
  }
  
  if (category) {
    query = query.eq('category_new', category)
  }

  const result = await query.range(offset, offset + limit - 1)
  
  return {
    data: result.data || [],
    error: result.error,
    count: result.count
  }
}

export async function getFeaturedEscapeRooms(limit = 6) {
  console.log('=== getFeaturedEscapeRooms DEBUG ===')
  console.log('Requested limit:', limit)
  
  const { data, error, count } = await supabase
    .from('escape_rooms')
    .select('*', { count: 'exact' })
    .eq('status', 'Open')
    .order('rating', { ascending: false })
    .order('reviews_average', { ascending: false })
    .limit(limit)

  console.log('Query result:')
  console.log('- Data length:', data?.length)
  console.log('- Total count:', count)
  console.log('- Error:', error)
  console.log('- All returned data:', data)
  console.log('================================')

  if (error) {
    console.error('Error fetching featured escape rooms:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

export async function getEscapeRoomsByState(state: string, limit?: number) {
  // Get both full state name and abbreviation for better matching
  const fullStateName = getFullStateName(state)
  const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()]
  
  let query = supabase
    .from('escape_rooms')
    .select('*')
    .eq('status', 'Open')
    .order('rating', { ascending: false })
  
  // Search for both full name and abbreviation with exact matching
  if (stateAbbr) {
    // Use exact match for abbreviation and contains match for full name
    query = query.or(`state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`)
  } else {
    query = query.ilike('state', `%${state}%`)
  }
  
  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching escape rooms by state:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

export async function getEscapeRoomsByCity(city: string, state?: string, limit?: number) {
  let query = supabase
    .from('escape_rooms')
    .select('*')
    .eq('status', 'Open')
    .ilike('city', `%${city}%`)
    .order('rating', { ascending: false })

  if (state) {
    // Get both full state name and abbreviation for better matching
    const fullStateName = getFullStateName(state)
    const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()]
    
    if (stateAbbr) {
      // Use exact match for abbreviation and contains match for full name
      query = query.or(`state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`)
    } else {
      query = query.ilike('state', `%${state}%`)
    }
  }
  
  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching escape rooms by city:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

export async function getStatesWithCounts() {
  const { data, error } = await supabase
    .from('escape_rooms')
    .select('state')
    .eq('status', 'Open')
    .not('state', 'is', null)

  if (error) {
    console.error('Error fetching states:', error)
    return { data: [], error }
  }

  // Count rooms by state using full state names
  const stateCounts = data.reduce((acc: Record<string, { count: number; abbreviation: string; fullName: string }>, room) => {
    const state = room.state?.trim()
    if (state) {
      const fullStateName = getFullStateName(state)
      const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()] || state
      
      if (!acc[fullStateName]) {
        acc[fullStateName] = {
          count: 0,
          abbreviation: stateAbbr,
          fullName: fullStateName
        }
      }
      acc[fullStateName].count += 1
    }
    return acc
  }, {})

  // Convert to array and sort by count
  const statesArray = Object.entries(stateCounts)
    .map(([fullName, { count, abbreviation }]) => ({ 
      state: abbreviation, 
      fullName, 
      count 
    }))
    .sort((a, b) => b.count - a.count)

  return { data: statesArray, error: null }
}

export async function getNearbyCities(state: string) {
  // Get both full state name and abbreviation for better matching
  const fullStateName = getFullStateName(state)
  const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()]
  
  let query = supabase
    .from('escape_rooms')
    .select('city, state')
    .eq('status', 'Open')
    .not('city', 'is', null)
    .order('rating', { ascending: false })
  
  // Use exact match for abbreviation and contains match for full name
  if (stateAbbr) {
    query = query.or(`state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`)
  } else {
    query = query.ilike('state', `%${state}%`)
  }
  
  const { data, error } = await query

  if (error) {
    console.error('Error fetching nearby cities:', error)
    return []
  }

  // Remove duplicates and return unique cities
  const uniqueCities = data?.reduce((acc: Array<{city: string, state: string}>, room) => {
    const exists = acc.some(item => item.city.toLowerCase() === room.city?.toLowerCase())
    if (!exists && room.city && room.state) {
      acc.push({ city: room.city, state: room.state })
    }
    return acc
  }, [])

  return uniqueCities
}

export async function getNearbyRooms(roomId: string, city: string, state: string) {
  // Get both full state name and abbreviation for better matching
  const fullStateName = getFullStateName(state)
  const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()]
  
  let stateCondition = `state.ilike.%${state}%`
  if (stateAbbr) {
    stateCondition = `state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`
  }
  
  const { data, error } = await supabase
    .from('escape_rooms')
    .select('id, name, city, state, rating, photo')
    .eq('status', 'Open')
    .or(`city.ilike.%${city}%,${stateCondition}`)
    .neq('id', roomId)
    .order('rating', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching nearby rooms:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

export async function getStatesWithRoomCounts(country?: string) {
  try {
    // Fetch all records using pagination to ensure we get complete data
    let allData: EscapeRoom[] = []
    let from = 0
    const batchSize = 1000
    
    while (true) {
      let query = supabase
        .from('escape_rooms')
        .select('state, city, country')
        .eq('status', 'Open')
        .not('state', 'is', null)
        .not('city', 'is', null)
        .range(from, from + batchSize - 1)

      // Filter by country if provided - handle both 'usa' and 'United States' formats
      if (country) {
        if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'united states') {
          query = query.eq('country', 'United States')
        } else {
          query = query.eq('country', country)
        }
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching states with room counts:', error)
        return { data: [], error }
      }
      
      if (!data || data.length === 0) break
      
      allData = allData.concat(data)
      
      if (data.length < batchSize) break
      
      from += batchSize
    }

    console.log(`Total records fetched: ${allData.length}`)

  // Create a map to store state data
  const stateData = new Map<string, { room_count: number; cities: Set<string>; abbreviation: string }>()

  // Process each room
  for (const room of allData) {
    // Clean state and city names by removing null characters and trimming
    const state = room.state?.replace(/\0/g, '').trim()
    const city = room.city?.replace(/\0/g, '').trim()
    
    if (state && city) {
      // Get the full state name to ensure consistent naming
      const fullStateName = getFullStateName(state)
      const stateAbbr = FULL_STATE_NAMES[fullStateName.toLowerCase()] || state
      
      console.log('Processing state:', { original: state, full: fullStateName, abbr: stateAbbr })
      
      if (!stateData.has(fullStateName)) {
        stateData.set(fullStateName, { room_count: 0, cities: new Set(), abbreviation: stateAbbr })
      }
      const stateInfo = stateData.get(fullStateName)!
      stateInfo.room_count += 1
      stateInfo.cities.add(city)
    }
  }

    // Convert to array and sort alphabetically by state name
    console.log('State data before conversion:', Array.from(stateData.entries()))
    const statesArray = Array.from(stateData.entries())
      .map(([state, data]) => {
        const stateObj = {
          state: data.abbreviation, // Use abbreviation for URL generation
          fullName: state, // Keep full name for display
          room_count: data.room_count,
          city_count: data.cities.size
        }
        return stateObj
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
    return { data: statesArray, error: null }
    
  } catch (error) {
    console.error('Error in getStatesWithRoomCounts:', error)
    return { data: [], error }
  }
}

export async function getAllStatesFromDatabase() {
  const { data, error } = await supabase
    .from('escape_rooms')
    .select('state')
    .eq('status', 'Open')
    .not('state', 'is', null)

  if (error) {
    console.error('Error fetching all states:', error)
    return { data: [], error }
  }

  // Get unique states, clean null characters, filter out abbreviations (2-3 characters), and sort alphabetically
  const uniqueStates = [...new Set(data.map(room => room.state?.replace(/\0/g, '').trim()).filter(Boolean))]
    .filter(state => state.length > 3) // Filter out abbreviations like "CA", "NY", "TX"
    .sort((a, b) => a.localeCompare(b))

  return { data: uniqueStates, error: null }
}

export async function getCitiesWithCounts(state?: string) {
  console.log(`getCitiesWithCounts called with state: "${state}"`)
  
  // Get both full state name and abbreviation for better matching
  const fullStateName = state ? getFullStateName(state) : ''
  const stateAbbr = fullStateName ? FULL_STATE_NAMES[fullStateName.toLowerCase()] : ''
  
  console.log(`Full state name: "${fullStateName}", State abbreviation: "${stateAbbr}"`)

  let query = supabase
    .from('escape_rooms')
    .select('city, state')
    .eq('status', 'Open')
    .not('city', 'is', null)
    .not('state', 'is', null)

  // Add state filter if provided
  if (state) {
    // Use exact match for abbreviation and contains match for full name
    if (stateAbbr) {
      query = query.or(`state.ilike.%${fullStateName}%,state.eq.${stateAbbr}`)
    } else {
      query = query.ilike('state', `%${state}%`)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching cities:', error)
    return { data: [], error }
  }

  if (!data) {
    return { data: [], error: null }
  }

  // Count cities manually since we can't use group by
  const cityCounts: Record<string, { city: string; state: string; count: number }> = {}
  
  data.forEach(room => {
    const city = room.city?.replace(/\0/g, '').trim()
    const roomState = room.state?.replace(/\0/g, '').trim()
    
    if (!city || !roomState) return
    
    const key = `${city}|${roomState}`
    
    if (!cityCounts[key]) {
      cityCounts[key] = { city, state: roomState, count: 0 }
    }
    cityCounts[key].count++
  })

  // Convert to array and sort by count
  const citiesArray = Object.values(cityCounts)
    .filter(row => row.city && row.state) // Remove any rows with empty city or state
    .sort((a, b) => b.count - a.count)

  console.log(`getCitiesWithCounts for state "${state}": Found ${citiesArray.length} cities`)
  
  return { data: citiesArray, error: null }
}

export async function getThemesWithCounts() {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration missing - using fallback data')
      return { 
        data: [
          { theme: 'Adventure', count: 150 },
          { theme: 'Mystery', count: 120 },
          { theme: 'Horror', count: 100 },
          { theme: 'Fantasy', count: 80 },
          { theme: 'Sci-Fi', count: 60 },
          { theme: 'Historical', count: 40 }
        ], 
        error: null 
      }
    }

    // Fetch all records to ensure accurate counting
    let allData: EscapeRoom[] = []
    let from = 0
    const batchSize = 1000
    
    while (true) {
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('category_new')
        .eq('status', 'Open')
        .not('category_new', 'is', null)
        .range(from, from + batchSize - 1)
      
        if (error) {
          console.warn('Error fetching themes from Supabase, using fallback data:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          return { 
            data: [
              { theme: 'Adventure', count: 150 },
              { theme: 'Mystery', count: 120 },
              { theme: 'Horror', count: 100 },
              { theme: 'Fantasy', count: 80 },
              { theme: 'Sci-Fi', count: 60 },
              { theme: 'Historical', count: 40 }
            ], 
            error: null 
          }
        }
      
      if (!data || data.length === 0) break
      
      allData = allData.concat(data)
      
      if (data.length < batchSize) break
      
      from += batchSize
    }

    // Count rooms by theme using all fetched data
    const themeCounts = allData.reduce((acc: Record<string, number>, room) => {
      const theme = room.category_new?.trim()
      if (theme) {
        acc[theme] = (acc[theme] || 0) + 1
      }
      return acc
    }, {})

    // Convert to array and sort by count, then alphabetically
    const themesArray = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return a.theme.localeCompare(b.theme)
      })

    return { data: themesArray, error: null }
  } catch (error) {
    console.warn('Error fetching themes with counts, using fallback data:', error)
    return { 
      data: [
        { theme: 'Adventure', count: 150 },
        { theme: 'Mystery', count: 120 },
        { theme: 'Horror', count: 100 },
        { theme: 'Fantasy', count: 80 },
        { theme: 'Sci-Fi', count: 60 },
        { theme: 'Historical', count: 40 }
      ], 
      error: null 
    }
  }
}

export async function getEscapeRoomById(id: string) {
  try {
    const { data: room, error } = await supabase
      .from('escape_rooms')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching room:', error)
      throw error
    }

    if (!room) {
      return null
    }

    return formatRoomForDisplay(room)
  } catch (error) {
    console.error('Error in getEscapeRoomById:', error)
    return null
  }
}

export async function getRoomAmenities(roomId: string) {
  try {
    const { data: amenities, error } = await supabase
      .from('room_amenities')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_available', true)
    
    if (error) {
      console.error('Error fetching amenities:', error)
      return []
    }

    return amenities || []
  } catch (error) {
    console.error('Error in getRoomAmenities:', error)
    return []
  }
}

export async function getRoomBusinessHours(roomId: string) {
  try {
    const { data: hours, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('room_id', roomId)
      .order('day_of_week')
    
    if (error) {
      console.error('Error fetching business hours:', error)
      return []
    }

    return hours || []
  } catch (error) {
    console.error('Error in getRoomBusinessHours:', error)
    return []
  }
}

export async function getDatabaseStats() {
  try {
    console.log('getDatabaseStats called')
    
    // Get total escape rooms count
    const { count: totalRooms, error: roomsError } = await supabase
      .from('escape_rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Open')

    if (roomsError) {
      console.error('Error fetching rooms count:', roomsError)
    }

    // Get unique cities count
    const { data: citiesData, error: citiesError } = await supabase
      .from('escape_rooms')
      .select('city, state')
      .eq('status', 'Open')
      .not('city', 'is', null)
      .not('state', 'is', null)

    let uniqueCities = 0
    if (!citiesError && citiesData) {
      const citySet = new Set(citiesData.map(room => `${room.city?.trim()}, ${room.state?.trim()}`))
      uniqueCities = citySet.size
    }


    // Get average rating
    const { data: ratingData, error: ratingError } = await supabase
      .from('escape_rooms')
      .select('rating')
      .eq('status', 'Open')
      .not('rating', 'is', null)
      .gte('rating', 1)

    let averageRating = 4.2 // fallback
    if (!ratingError && ratingData && ratingData.length > 0) {
      const sum = ratingData.reduce((acc, room) => acc + (room.rating || 0), 0)
      averageRating = Math.round((sum / ratingData.length) * 10) / 10
    }

    // Get total reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('escape_rooms')
      .select('reviews_average')
      .eq('status', 'Open')
      .not('reviews_average', 'is', null)
      .gte('reviews_average', 1)

    let totalReviews = 0
    if (!reviewsError && reviewsData) {
      totalReviews = reviewsData.reduce((acc, room) => acc + (room.reviews_average || 0), 0)
    }

    // Get unique states count using pagination
    const allStates = new Set<string>()
    let from = 0
    const batchSize = 1000
    
    while (true) {
      const { data: statesData, error: statesError } = await supabase
        .from('escape_rooms')
        .select('state')
        .eq('status', 'Open')
        .not('state', 'is', null)
        .order('state')
        .range(from, from + batchSize - 1)
      
      if (statesError) {
        console.error('Error fetching states:', statesError)
        break
      }
      
      if (!statesData || statesData.length === 0) break
      
      statesData
        .map(room => room.state?.trim())
        .filter(Boolean)
        .forEach(state => allStates.add(state))
      
      if (statesData.length < batchSize) break
      
      from += batchSize
    }
    
    const uniqueStates = allStates.size

    const result = {
      totalRooms: totalRooms || 0,
      uniqueCities,
      uniqueStates,
      averageRating,
      totalReviews,
      error: null
    }
    
    return result
  } catch (error) {
    console.error('Error fetching database stats:', error)
    return {
      totalRooms: 0,
      uniqueCities: 0,
      uniqueStates: 0,
      averageRating: 4.2,
      totalReviews: 0,
      error
    }
  }
}

// Utility functions
function cleanVenueName(roomName: string, city: string, state: string): string {
  let cleanName = roomName
  
  // Create variations of city and state names to match against
  const cityVariations = [
    city,
    city.toLowerCase(),
    city.replace(/\s+/g, '-').toLowerCase(),
    city.replace(/\s+/g, '').toLowerCase(),
    // Handle abbreviated forms like "St. Louis" -> "St Louis"
    city.replace(/\./g, '').toLowerCase(),
    city.replace(/\./g, ' ').toLowerCase().trim()
  ]
  
  const stateVariations = [
    state,
    state.toLowerCase(),
    state.replace(/\s+/g, '-').toLowerCase(),
    state.replace(/\s+/g, '').toLowerCase()
  ]
  
  // Remove common separators and location suffixes
  const patterns = [
    // Remove content in parentheses that contains city or state
    new RegExp(`\\s*\\([^)]*(?:${cityVariations.join('|')}|${stateVariations.join('|')})[^)]*\\)\\s*`, 'gi'),
    // Remove city-state combinations with various separators
    new RegExp(`\\s*[-–—]\\s*(?:${cityVariations.join('|')})(?:\\s*[-–—,]\\s*(?:${stateVariations.join('|')}))?\\s*$`, 'gi'),
    new RegExp(`\\s*[-–—]\\s*(?:${stateVariations.join('|')})(?:\\s*[-–—,]\\s*(?:${cityVariations.join('|')}))?\\s*$`, 'gi'),
    // Remove just city or state at the end with separators
    new RegExp(`\\s*[-–—]\\s*(?:${cityVariations.join('|')})\\s*$`, 'gi'),
    new RegExp(`\\s*[-–—]\\s*(?:${stateVariations.join('|')})\\s*$`, 'gi')
  ]
  
  patterns.forEach(pattern => {
    cleanName = cleanName.replace(pattern, '')
  })
  
  return cleanName.trim()
}

export function formatRoomForDisplay(room: EscapeRoom) {
  // Use actual rating data from database and convert string to number
  const actualRating = room.rating ? parseFloat(room.rating.toString()) : null
  
  // Use reviews_average as the review count (it contains number of reviews, not average)
  const reviewCount = room.reviews_average || 0
  
  // Clean venue name to avoid duplicate location info in URLs
  const cleanedVenueName = room.city && room.state ? 
    cleanVenueName(room.name, room.city, room.state) : 
    room.name
  
  return {
    id: room.id,
    name: room.name,
    location: `${room.city || 'Unknown'}, ${room.state || 'Unknown'}`,
    city: room.city || 'Unknown',
    state: room.state || 'Unknown',
    venue_name: cleanedVenueName, // Use cleaned venue name for URL generation
    rating: actualRating,
    reviews: reviewCount,
    reviews_average: reviewCount, // Add reviews_average for compatibility
    theme: room.category_new || 'Adventure',
    category_new: room.category_new || 'Adventure', // Add category_new for compatibility
    difficulty: room.difficulty || 'Beginner',
    image: room.photo || '/placeholder.svg',
    photo: room.photo || '/placeholder.svg', // Add photo for compatibility
    description: room.description || '',
    post_content: room.post_content || '', // Add post_content
    address: room.full_address || '',
    full_address: room.full_address || '', // Add full_address for compatibility
    website: room.website || '',
    phone: room.phone || '', // Add phone
    latitude: room.latitude, // Add latitude
    longitude: room.longitude, // Add longitude
    price: null, // No default price - use actual data when available
    booking_url: room.order_links || '',
    order_links: room.order_links || '', // Add order_links for compatibility
    duration: 60, // Default duration in minutes
    players: '2-6' // Default player range
  }
}

export function createSEOFriendlySlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function formatStateForURL(state: string): string {
  return createSEOFriendlySlug(state)
}

export function formatCityForURL(city: string): string {
  if (!city) return ''
  
  // Handle special characters and apostrophes
  return city
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export async function getCountryStats() {
  const { data, error } = await supabase
    .from('escape_rooms')
    .select('country, state, city')
    .eq('status', 'Open')
    .not('country', 'is', null)
    .not('state', 'is', null)
    .not('city', 'is', null)

  if (error) {
    console.error('Error fetching country stats:', error)
    return { data: [], error }
  }

  // Count rooms, states, and cities by country
  const countryData = data.reduce((acc: Record<string, { room_count: number; states: Set<string>; cities: Set<string> }>, room) => {
    const country = room.country?.trim()
    const state = room.state?.trim()
    const city = room.city?.trim()
    
    if (country && state && city) {
      if (!acc[country]) {
        acc[country] = { room_count: 0, states: new Set(), cities: new Set() }
      }
      acc[country].room_count += 1
      acc[country].states.add(state)
      acc[country].cities.add(city)
    }
    return acc
  }, {})

  // Convert to array and sort by room count
  const countriesArray = Object.entries(countryData)
    .map(([country, data]) => ({
      country,
      room_count: data.room_count,
      state_count: data.states.size,
      city_count: data.cities.size
    }))
    .sort((a, b) => b.room_count - a.room_count)

  return { data: countriesArray, error: null }
}

export async function getAllCountriesFromDatabase() {
  const { data, error } = await supabase
    .from('escape_rooms')
    .select('country')
    .eq('status', 'Open')
    .not('country', 'is', null)

  if (error) {
    console.error('Error fetching countries:', error)
    return { data: [], error }
  }

  // Get unique countries and sort them
  const uniqueCountries = [...new Set(data.map(room => room.country?.trim()).filter(Boolean))]
    .sort()

  return { data: uniqueCountries, error: null }
}

// State abbreviation to full name mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia', 'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam',
  'AS': 'American Samoa', 'MP': 'Northern Mariana Islands'
}

// Full name to abbreviation mapping (reverse lookup)
const FULL_STATE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBREVIATIONS).map(([abbr, full]) => [full.toLowerCase(), abbr])
)

export function getFullStateName(stateInput: string): string {
  const trimmed = stateInput.trim()
  
  // If it's an abbreviation, convert to full name
  if (STATE_ABBREVIATIONS[trimmed.toUpperCase()]) {
    return STATE_ABBREVIATIONS[trimmed.toUpperCase()]
  }
  
  // If it's already a full state name (check if it exists in our abbreviations mapping), return it
  const isFullStateName = Object.values(STATE_ABBREVIATIONS).some(
    fullName => fullName.toLowerCase() === trimmed.toLowerCase()
  )
  if (isFullStateName) {
    // Return with proper capitalization from our mapping
    return Object.values(STATE_ABBREVIATIONS).find(
      fullName => fullName.toLowerCase() === trimmed.toLowerCase()
    ) || trimmed
  }
  
  // If it's a URL-formatted state name, parse it
  const urlParsed = trimmed
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return urlParsed
}

export function parseStateFromURL(urlState: string): string {
  // Convert URL-friendly state name back to proper state name
  return getFullStateName(urlState)
}

export function parseCityFromURL(urlCity: string): string {
  if (!urlCity) return ''

  // Special cases mapping (add more as needed)
  const specialCases: Record<string, string> = {
    'coeur-dalene': "Coeur d'Alene",
    'st-petersburg': 'St. Petersburg',
    'st-augustine': 'St. Augustine',
    'st-louis': 'St. Louis',
    'st-cloud': 'St Cloud',
    'st-paul': 'St Paul',
    'st-charles': 'St Charles',
    'st-peters': 'St Peters',
    'st-george': 'St. George',
    'port-st-lucie': 'Port St. Lucie'
  }

  // Check if it's a special case
  const normalizedUrl = urlCity.toLowerCase()
  if (specialCases[normalizedUrl]) {
    return specialCases[normalizedUrl]
  }

  // Handle regular cases
  return urlCity
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatVenueForURL(venueName: string): string {
  return createSEOFriendlySlug(venueName)
}

export function parseVenueFromURL(urlVenue: string): string {
  // Convert URL-friendly venue name back to proper venue name
  // Handle articles and prepositions that should remain lowercase
  const lowercaseWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
  
  return urlVenue
    .split('-')
    .map((word, index) => {
      // Always capitalize the first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      // Keep articles and prepositions lowercase unless they're the first word
      if (lowercaseWords.has(word.toLowerCase())) {
        return word.toLowerCase()
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export async function getEscapeRoomByVenue(venueName: string, city: string, state: string) {
  try {
    // Get all rooms in the city/state first
    const { data: allRooms, error: fetchError } = await supabase
      .from('escape_rooms')
      .select('*')
      .ilike('city', `%${city}%`)
      .or(`state.ilike.%${getFullStateName(state)}%,state.eq.${FULL_STATE_NAMES[getFullStateName(state).toLowerCase()] || state}`)
      .eq('status', 'Open')
    
    if (fetchError) {
      console.error('Error fetching rooms by location:', fetchError)
      return { data: null, error: fetchError }
    }
    
    if (!allRooms || allRooms.length === 0) {
      return { data: null, error: { code: 'PGRST116', message: 'No rooms found' } }
    }
    
    // Find the best match by comparing cleaned venue names
    let bestMatch = null
    let bestScore = 0
    
    for (const room of allRooms) {
      const cleanedDbName = cleanVenueName(room.name, city, state)
      const cleanedDbSlug = createSEOFriendlySlug(cleanedDbName)
      const inputSlug = createSEOFriendlySlug(venueName)
      
      // Exact match on cleaned slug
      if (cleanedDbSlug === inputSlug) {
        bestMatch = room
        break
      }
      
      // Also try exact match on original room name slug
      const originalSlug = createSEOFriendlySlug(room.name)
      if (originalSlug === inputSlug) {
        bestMatch = room
        break
      }
      
      // Partial match scoring - try both cleaned and original names
      const dbWords = cleanedDbName.toLowerCase().split(' ')
      const originalWords = room.name.toLowerCase().split(' ')
      const inputWords = venueName.toLowerCase().split(' ')
      let matchScore = 0
      
      // Score against cleaned name
      for (const inputWord of inputWords) {
        for (const dbWord of dbWords) {
          if (dbWord.includes(inputWord) || inputWord.includes(dbWord)) {
            matchScore += Math.min(inputWord.length, dbWord.length)
          }
        }
      }
      
      // Score against original name (with higher weight)
      for (const inputWord of inputWords) {
        for (const originalWord of originalWords) {
          if (originalWord.includes(inputWord) || inputWord.includes(originalWord)) {
            matchScore += Math.min(inputWord.length, originalWord.length) * 1.5
          }
        }
      }
      
      if (matchScore > bestScore) {
        bestScore = matchScore
        bestMatch = room
      }
    }
    
    if (!bestMatch) {
      return { data: null, error: { code: 'PGRST116', message: 'No matching venue found' } }
    }
    
    return { data: bestMatch, error: null }
  } catch (error) {
    console.error('Error in getEscapeRoomByVenue:', error)
    return { data: null, error }
  }
}