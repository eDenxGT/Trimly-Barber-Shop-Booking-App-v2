import { Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LastBookingCardProps {
  shopName: string
  date: string
  time: string
  status: "Completed" | "Upcoming" | "Missed"
}

export default function LastBookingCard({ shopName, date, time, status }: LastBookingCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-500 hover:bg-green-600"
      case "Upcoming":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Missed":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card className="p-6 max-w-3xl mx-auto border-2 border-gray-100 hover:border-[#feba43] transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{shopName}</h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#feba43]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#feba43]" />
              <span>{time}</span>
            </div>
          </div>

          <Badge className={`${getStatusColor()} text-white px-3 py-1 text-sm font-medium`}>{status}</Badge>
        </div>

        <div className="flex flex-col gap-3 md:self-end">
          <Button variant="outline" className="border-[#feba43] text-[#feba43] hover:bg-[#feba43] hover:text-white">
            View Details
          </Button>
          <Button className="bg-[#feba43] hover:bg-[#e5a93c] text-black font-semibold">Book Again</Button>
        </div>
      </div>
    </Card>
  )
}
