import { Metadata } from 'next'
import { parseStateFromURL, parseCityFromURL, formatStateForURL } from '@/lib/supabase'
import CityPageClient from './city-page-client'
import { createCityMetadata } from '@/lib/metadata'
import { supabase } from '@/lib/supabase'

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

interface CityPageProps {
  params: Promise<{ country: string; state: string; city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const stateName = parseStateFromURL(resolvedParams.state)
  const cityName = parseCityFromURL(resolvedParams.city)
  const countryName = resolvedParams.country
  
  // Get room count for this city (you can add this logic later if needed)
  const roomCount = 10 // Placeholder - replace with actual count from database
  
  return createCityMetadata(
    cityName,
    stateName,
    countryName,
    roomCount
  )
}

export default function CityPage({ params }: CityPageProps) {
  return <CityPageClient params={params} />
}