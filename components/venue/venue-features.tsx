import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VenueFeaturesProps {
  features: string[]
}

export default function VenueFeatures({ features }: VenueFeaturesProps) {
  if (!features || features.length === 0) return null

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="justify-start">
              {String(feature)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
