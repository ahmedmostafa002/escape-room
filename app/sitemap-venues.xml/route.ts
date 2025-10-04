import { NextResponse } from 'next/server'
import { getEscapeRooms } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://escaperoomsfinder.com'
  
  try {
    // Get all venues with pagination
    const venuesData = await getEscapeRooms({ limit: 10000 })
    const venues = venuesData.data || []

    const formatVenueForURL = (venueName: string) => {
      return venueName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
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

    const venueUrls = venues.map((venue) => {
      return `  <url>
    <loc>${baseUrl}/locations/united-states/${formatStateForURL(venue.state)}/${formatCityForURL(venue.city)}/${formatVenueForURL(venue.name)}</loc>
    <lastmod>${new Date(venue.updated_at || venue.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    }).join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${venueUrls}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error generating venues sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
