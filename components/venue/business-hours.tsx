import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BusinessHoursProps {
  schedule: { day: string; hours: string }[]
}

export default function BusinessHours({ schedule }: BusinessHoursProps) {
  if (schedule.length === 0) return null

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {schedule.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{item.day}</span>
              <span className="text-sm text-gray-600">{item.hours}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
