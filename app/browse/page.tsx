import { Metadata } from 'next'
import { getDatabaseStats } from '@/lib/supabase'
import BrowsePageClient from '@/components/browse-page-client'
import { createBrowseMetadata } from '@/lib/metadata'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const stats = await getDatabaseStats()
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  
  // Use the utility function to generate metadata
  return createBrowseMetadata(
    resolvedSearchParams,
    stats.totalRooms || 1000,
    currentPage
  )
}

export default function BrowsePage() {
  return <BrowsePageClient />
}
