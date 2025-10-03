import { supabase } from './supabase'

export interface CityOption {
  city: string
  state: string
  count: number
}

export interface ZipCodeOption {
  zip_code: string
  city: string
  state: string
}

export async function getCitiesFromDatabase(): Promise<{ success: boolean; cities?: CityOption[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('city, state')
      .not('city', 'is', null)
      .not('state', 'is', null)

    if (error) {
      console.error('Error fetching cities:', error)
      return { success: false, error: error.message }
    }

    // Group by city and state, count occurrences
    const cityMap = new Map<string, CityOption>()
    
    data.forEach(room => {
      if (room.city && room.state) {
        const key = `${room.city}-${room.state}`
        if (cityMap.has(key)) {
          cityMap.get(key)!.count += 1
        } else {
          cityMap.set(key, {
            city: room.city,
            state: room.state,
            count: 1
          })
        }
      }
    })

    const cities = Array.from(cityMap.values())
      .sort((a, b) => {
        // Sort by state first, then by city
        if (a.state !== b.state) {
          return a.state.localeCompare(b.state)
        }
        return a.city.localeCompare(b.city)
      })

    return { success: true, cities }
  } catch (error) {
    console.error('Error fetching cities:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getZipCodesFromDatabase(): Promise<{ success: boolean; zipCodes?: ZipCodeOption[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('postal_code, city, state')
      .not('postal_code', 'is', null)
      .not('city', 'is', null)
      .not('state', 'is', null)

    if (error) {
      console.error('Error fetching zip codes:', error)
      return { success: false, error: error.message }
    }

    // Group by zip code, get unique city/state combinations
    const zipMap = new Map<string, ZipCodeOption>()
    
    data.forEach(room => {
      if (room.postal_code && room.city && room.state) {
        const key = room.postal_code
        if (!zipMap.has(key)) {
          zipMap.set(key, {
            zip_code: room.postal_code,
            city: room.city,
            state: room.state
          })
        }
      }
    })

    const zipCodes = Array.from(zipMap.values())
      .sort((a, b) => {
        // Sort by state first, then by city, then by zip code
        if (a.state !== b.state) {
          return a.state.localeCompare(b.state)
        }
        if (a.city !== b.city) {
          return a.city.localeCompare(b.city)
        }
        return a.zip_code.localeCompare(b.zip_code)
      })

    return { success: true, zipCodes }
  } catch (error) {
    console.error('Error fetching zip codes:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getCitiesByState(state: string): Promise<{ success: boolean; cities?: CityOption[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('city, state')
      .eq('state', state)
      .not('city', 'is', null)

    if (error) {
      console.error('Error fetching cities by state:', error)
      return { success: false, error: error.message }
    }

    // Group by city, count occurrences
    const cityMap = new Map<string, CityOption>()
    
    data.forEach(room => {
      if (room.city) {
        const key = room.city
        if (cityMap.has(key)) {
          cityMap.get(key)!.count += 1
        } else {
          cityMap.set(key, {
            city: room.city,
            state: room.state,
            count: 1
          })
        }
      }
    })

    const cities = Array.from(cityMap.values())
      .sort((a, b) => a.city.localeCompare(b.city))

    return { success: true, cities }
  } catch (error) {
    console.error('Error fetching cities by state:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getZipCodesByCity(city: string, state: string): Promise<{ success: boolean; zipCodes?: ZipCodeOption[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('postal_code, city, state')
      .eq('city', city)
      .eq('state', state)
      .not('postal_code', 'is', null)

    if (error) {
      console.error('Error fetching zip codes by city:', error)
      return { success: false, error: error.message }
    }

    // Group by zip code
    const zipMap = new Map<string, ZipCodeOption>()
    
    data.forEach(room => {
      if (room.postal_code) {
        const key = room.postal_code
        if (!zipMap.has(key)) {
          zipMap.set(key, {
            zip_code: room.postal_code,
            city: room.city,
            state: room.state
          })
        }
      }
    })

    const zipCodes = Array.from(zipMap.values())
      .sort((a, b) => a.zip_code.localeCompare(b.zip_code))

    return { success: true, zipCodes }
  } catch (error) {
    console.error('Error fetching zip codes by city:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
