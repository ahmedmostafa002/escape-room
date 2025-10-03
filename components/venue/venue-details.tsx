import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Target, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

interface VenueDetailsProps {
  difficulty?: string
  teamSize?: string
  duration?: string
  price?: string
  orderLinks?: string
}

export default function VenueDetails({ 
  difficulty, 
  teamSize, 
  duration, 
  price, 
  orderLinks 
}: VenueDetailsProps) {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Escape Room Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Difficulty */}
        {difficulty && (
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Difficulty</p>
              <p className="text-sm text-escape-red font-semibold">{difficulty}</p>
            </div>
          </div>
        )}

        {/* Team Size */}
        {teamSize && (
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Team Size</p>
              <p className="text-sm text-gray-600">{teamSize}</p>
            </div>
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-sm text-gray-600">{duration}</p>
            </div>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Price</p>
              <p className="text-sm text-escape-red font-semibold">${price}</p>
            </div>
          </div>
        )}

        {/* Booking Button */}
        {orderLinks && (
          <div className="pt-4 border-t border-gray-100">
            <Link
              href={orderLinks}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-escape-red hover:bg-escape-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                <Calendar className="h-4 w-4 mr-2" />
                Book Your Adventure
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
