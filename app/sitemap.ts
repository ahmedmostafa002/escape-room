import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/sanity'
import { getStatesWithRoomCounts, getCitiesWithCounts, getThemesWithCounts, getEscapeRooms } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://escaperoomsfinder.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/add-listing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Get dynamic data
  const [blogPosts, statesData, themesData, venuesData] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getStatesWithRoomCounts().catch(() => ({ data: [] })),
    getThemesWithCounts().catch(() => ({ data: [] })),
    getEscapeRooms({ limit: 10000 }).catch(() => ({ data: [] })) // Increased limit to include all venues
  ])

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // State pages
  const statePages = statesData.data.map((state) => ({
    url: `${baseUrl}/locations/united-states/${state.state.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Theme pages
  const themePages = themesData.data.map((theme) => ({
    url: `${baseUrl}/themes/${theme.theme.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // City pages (increased limits to include more pages)
  const cityPages: MetadataRoute.Sitemap = []
  for (const state of statesData.data) { // Include all states
    try {
      const citiesData = await getCitiesWithCounts(state.state)
      const topCities = citiesData.data.slice(0, 50) // Top 50 cities per state
      
      for (const city of topCities) {
        cityPages.push({
          url: `${baseUrl}/locations/united-states/${state.state.toLowerCase().replace(/\s+/g, '-')}/${city.city.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })
      }
    } catch (error) {
      console.error(`Error fetching cities for ${state.state}:`, error)
    }
  }

  // Individual venue pages
  const venuePages = venuesData.data.map((venue) => {
    // Format venue name for URL (same logic as in the venue page)
    const formatVenueForURL = (venueName: string) => {
      return venueName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim()
    }

    const formatCityForURL = (cityName: string) => {
      return cityName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    const formatStateForURL = (stateName: string) => {
      return stateName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    return {
      url: `${baseUrl}/locations/united-states/${formatStateForURL(venue.state)}/${formatCityForURL(venue.city)}/${formatVenueForURL(venue.name)}`,
      lastModified: new Date(venue.updated_at || venue.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // High priority for individual venues
    }
  })

  return [
    ...staticPages,
    ...blogPages,
    ...statePages,
    ...themePages,
    ...cityPages,
    ...venuePages,
  ]
}
