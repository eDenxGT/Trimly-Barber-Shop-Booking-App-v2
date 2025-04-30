import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { IMeetingRoom } from "@/types/Chat"

interface EditMeetingModalProps {
  meeting: IMeetingRoom
  isOpen: boolean
  onClose: () => void
  onSave: (meeting: IMeetingRoom) => void
}

export function EditMeetingModal({ meeting, isOpen, onClose, onSave }: EditMeetingModalProps) {
  const [editedMeeting, setEditedMeeting] = useState<IMeetingRoom>({ ...meeting })
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(parseISO(meeting.startTime.toString()))
  const [startHour, setStartHour] = useState("")
  const [startMinute, setStartMinute] = useState("")
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM")
  const [endHour, setEndHour] = useState("")
  const [endMinute, setEndMinute] = useState("")
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM")
  const [timeError, setTimeError] = useState("")

  useEffect(() => {
    if (meeting) {
      const startDate = parseISO(meeting.startTime.toString())
      const endDate = parseISO(meeting.endTime.toString())

      let startHourValue = startDate.getHours()
      const startPeriodValue = startHourValue >= 12 ? "PM" : "AM"
      startHourValue = startHourValue % 12 || 12 

      let endHourValue = endDate.getHours()
      const endPeriodValue = endHourValue >= 12 ? "PM" : "AM"
      endHourValue = endHourValue % 12 || 12 

      setStartHour(startHourValue.toString())
      setStartMinute(startDate.getMinutes().toString().padStart(2, "0"))
      setStartPeriod(startPeriodValue)

      setEndHour(endHourValue.toString())
      setEndMinute(endDate.getMinutes().toString().padStart(2, "0"))
      setEndPeriod(endPeriodValue)

      setMeetingDate(startDate)
    }
  }, [meeting])

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"))

  const validateTimes = () => {
    if (!meetingDate) return false

    let startHourValue = Number.parseInt(startHour)
    if (startPeriod === "PM" && startHourValue !== 12) startHourValue += 12
    if (startPeriod === "AM" && startHourValue === 12) startHourValue = 0

    let endHourValue = Number.parseInt(endHour)
    if (endPeriod === "PM" && endHourValue !== 12) endHourValue += 12
    if (endPeriod === "AM" && endHourValue === 12) endHourValue = 0

    const startTime = new Date(meetingDate)
    startTime.setHours(startHourValue, Number.parseInt(startMinute), 0)

    const endTime = new Date(meetingDate)
    endTime.setHours(endHourValue, Number.parseInt(endMinute), 0)

    if (endTime <= startTime) {
      setTimeError("End time must be after start time")
      return false
    }

    setTimeError("")
    return true
  }

  // Handle save
  const handleSave = () => {
    if (!validateTimes()) return

    // Convert to 24-hour format
    let startHourValue = Number.parseInt(startHour)
    if (startPeriod === "PM" && startHourValue !== 12) startHourValue += 12
    if (startPeriod === "AM" && startHourValue === 12) startHourValue = 0

    let endHourValue = Number.parseInt(endHour)
    if (endPeriod === "PM" && endHourValue !== 12) endHourValue += 12
    if (endPeriod === "AM" && endHourValue === 12) endHourValue = 0

    const startTime = new Date(meetingDate!)
    startTime.setHours(startHourValue, Number.parseInt(startMinute), 0)

    const endTime = new Date(meetingDate!)
    endTime.setHours(endHourValue, Number.parseInt(endMinute), 0)

    const updatedMeeting = {
      ...editedMeeting,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedMeeting as unknown as IMeetingRoom)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>Update the meeting details. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={editedMeeting.title}
              onChange={(e) => setEditedMeeting({ ...editedMeeting, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedMeeting.description}
              onChange={(e) => setEditedMeeting({ ...editedMeeting, description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetLink">Meeting Link</Label>
            <Input
              id="meetLink"
              value={editedMeeting.meetLink}
              onChange={(e) => setEditedMeeting({ ...editedMeeting, meetLink: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Meeting Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left", !meetingDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {meetingDate ? format(meetingDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={meetingDate} onSelect={setMeetingDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex space-x-2">
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((hour) => (
                      <SelectItem key={`start-hour-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="flex items-center">:</span>
                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((minute) => (
                      <SelectItem key={`start-minute-${minute}`} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={startPeriod} onValueChange={(value: "AM" | "PM") => setStartPeriod(value)}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex space-x-2">
                <Select value={endHour} onValueChange={setEndHour}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((hour) => (
                      <SelectItem key={`end-hour-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="flex items-center">:</span>
                <Select value={endMinute} onValueChange={setEndMinute}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((minute) => (
                      <SelectItem key={`end-minute-${minute}`} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={endPeriod} onValueChange={(value: "AM" | "PM") => setEndPeriod(value)}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {timeError && (
            <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
              <AlertDescription className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                {timeError}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
