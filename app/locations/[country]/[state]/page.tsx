import { Metadata } from 'next'
import { parseStateFromURL, getFullStateName, formatStateForURL } from "@/lib/supabase"
import { createStateMetadata } from '@/lib/metadata'
import StatePageClient from './state-page-client'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ country: string; state: string }> }): Promise<Metadata> {
  const { country, state } = await params
  const resolvedStateName = parseStateFromURL(state)
  const fullStateName = getFullStateName(resolvedStateName)
  const countryDisplayName = country === 'united-states' ? 'United States' : country.charAt(0).toUpperCase() + country.slice(1)
  
  return createStateMetadata(
    fullStateName,
    countryDisplayName
  )
}

export default async function StatePage({ params }: { params: Promise<{ country: string; state: string }> }) {
  const { country, state } = await params
  
  return <StatePageClient country={country} state={state} />
}
