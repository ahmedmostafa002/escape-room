import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { renderContent } from "@/lib/content-renderer"

interface VenueDescriptionProps {
  description?: string
  postContent?: string
}

export default function VenueDescription({ description, postContent }: VenueDescriptionProps) {
  if (!description && !postContent) return null

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">About This Escape Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {postContent && (
            <div className="text-gray-900 leading-relaxed mb-4">
              {renderContent(postContent)}
            </div>
          )}
          {description && (
            <div className="text-gray-900 leading-relaxed">
              {renderContent(description)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
