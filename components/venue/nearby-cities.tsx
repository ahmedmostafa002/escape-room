import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface NearbyCity {
  city: string
  state: string
}

interface NearbyCitiesProps {
  nearbyCities: NearbyCity[]
  currentCity: string
  country: string
  state: string
  formatCityForURL: (name: string) => string
}

export default function NearbyCities({ 
  nearbyCities, 
  currentCity, 
  country, 
  state, 
  formatCityForURL 
}: NearbyCitiesProps) {
  if (!nearbyCities || nearbyCities.length === 0) return null

  const filteredCities = nearbyCities
    .filter(city => city?.city && currentCity && city.city.toLowerCase() !== currentCity.toLowerCase())
    .slice(0, 5)

  if (filteredCities.length === 0) return null

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          Nearby Cities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredCities.map((city, index) => {
            const citySlug = formatCityForURL(city.city)
            return (
              <Link
                key={`${city.city}-${city.state}-${index}`}
                href={`/locations/${country}/${state}/${citySlug}`}
                className="block p-2 rounded-lg border border-gray-100 hover:border-escape-red/30 hover:bg-escape-red/5 transition-all duration-200"
              >
                <div className="font-medium text-sm text-gray-900">{city.city}, {city.state}</div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}