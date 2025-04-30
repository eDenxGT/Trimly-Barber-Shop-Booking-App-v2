import { useEffect, useState } from "react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { CalendarIcon, Clock, Info } from "lucide-react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { IMeetingRoom } from "@/types/Chat";
import { meetingSchema } from "@/utils/validations/meeting.validator";
import {
  convertTo24Hour,
} from "@/utils/helpers/timeFormatter";

interface EditMeetingModalProps {
  meeting: IMeetingRoom;
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: IMeetingRoom) => void;
}

export function EditMeetingModal({
  meeting,
  isOpen,
  onClose,
  onSave,
}: EditMeetingModalProps) {
  const [timeError, setTimeError] = useState<string>("");

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minuteOptions = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );

  const getTimeComponents = (isoString: string) => {
    const date = parseISO(isoString);
    let hours = date.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return {
      hour: hours.toString(),
      minute: minutes,
      period,
    };
  };

  const startTimeComponents = getTimeComponents(meeting.startTime.toString());
  const endTimeComponents = getTimeComponents(meeting.endTime.toString());
  const validateTimes = (values: any) => {
    if (!values.meetingDate) return true;

    const { hour: startHour24, minute: startMinute } = convertTo24Hour(
      values.startHour,
      values.startMinute,
      values.startPeriod
    );

    const { hour: endHour24, minute: endMinute } = convertTo24Hour(
      values.endHour,
      values.endMinute,
      values.endPeriod
    );

    const startTime = new Date(values.meetingDate);
    startTime.setHours(
      Number.parseInt(startHour24),
      Number.parseInt(startMinute),
      0
    );

    const endTime = new Date(values.meetingDate);
    endTime.setHours(Number.parseInt(endHour24), Number.parseInt(endMinute), 0);
    console.log(startTime, endTime, values);

    if (!isAfter(endTime, startTime)) {
      setTimeError("End time must be after start time");
      return false;
    }

    const now = new Date();
    if (isBefore(startTime, now)) {
      setTimeError("Start time must be after current time");
      return false;
    }

    setTimeError("");
    return true;
  };

  const formik = useFormik({
    initialValues: {
      title: meeting.title,
      description: meeting.description || "",
      meetLink: meeting.meetLink || "",
      meetingDate: parseISO(meeting.startTime.toString()),
      startHour: startTimeComponents.hour,
      startMinute: startTimeComponents.minute,
      startPeriod: startTimeComponents.period as "AM" | "PM",
      endHour: endTimeComponents.hour,
      endMinute: endTimeComponents.minute,
      endPeriod: endTimeComponents.period as "AM" | "PM",
    },
    validationSchema: meetingSchema,
    onSubmit: (values) => {
      if (!validateTimes(values)) return;

      const { hour: startHour24, minute: startMinute } = convertTo24Hour(
        values.startHour,
        values.startMinute,
        values.startPeriod
      );

      const { hour: endHour24, minute: endMinute } = convertTo24Hour(
        values.endHour,
        values.endMinute,
        values.endPeriod
      );

      const startTime = new Date(values.meetingDate);
      startTime.setHours(
        Number.parseInt(startHour24),
        Number.parseInt(startMinute),
        0
      );

      const endTime = new Date(values.meetingDate);
      endTime.setHours(
        Number.parseInt(endHour24),
        Number.parseInt(endMinute),
        0
      );

      const updatedMeeting = {
        ...meeting,
        title: values.title,
        description: values.description,
        meetLink: values.meetLink,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      };

      onSave(updatedMeeting);
    },
  });

  useEffect(() => {
    if (formik.values.meetingDate) {
      validateTimes(formik.values);
    }
  }, [
    formik.values.startHour,
    formik.values.startMinute,
    formik.values.startPeriod,
    formik.values.endHour,
    formik.values.endMinute,
    formik.values.endPeriod,
    formik.values.meetingDate,
  ]);

  useEffect(() => {
    if (meeting && isOpen) {
      const startComponents = getTimeComponents(meeting.startTime.toString());
      const endComponents = getTimeComponents(meeting.endTime.toString());

      formik.resetForm({
        values: {
          title: meeting.title,
          description: meeting.description || "",
          meetLink: meeting.meetLink || "",
          meetingDate: parseISO(meeting.startTime.toString()),
          startHour: startComponents.hour,
          startMinute: startComponents.minute,
          startPeriod: startComponents.period as "AM" | "PM",
          endHour: endComponents.hour,
          endMinute: endComponents.minute,
          endPeriod: endComponents.period as "AM" | "PM",
        },
      });

      setTimeError("");
    }
  }, [meeting, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>
            Update the meeting details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetLink">Meeting Link</Label>
            <Input
              id="meetLink"
              name="meetLink"
              value={formik.values.meetLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.meetLink && formik.errors.meetLink
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.meetLink && formik.errors.meetLink && (
              <p className="text-red-500 text-sm">{formik.errors.meetLink}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Meeting Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !formik.values.meetingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formik.values.meetingDate ? (
                    format(formik.values.meetingDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formik.values.meetingDate}
                  onSelect={(date) => formik.setFieldValue("meetingDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.meetingDate && formik.errors.meetingDate && (
              <p className="text-red-500 text-sm">
                {formik.errors.meetingDate as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex space-x-2">
                <Select
                  name="startHour"
                  value={formik.values.startHour}
                  onValueChange={(value) =>
                    formik.setFieldValue("startHour", value)
                  }
                >
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

                <Select
                  name="startMinute"
                  value={formik.values.startMinute}
                  onValueChange={(value) =>
                    formik.setFieldValue("startMinute", value)
                  }
                >
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

                <Select
                  name="startPeriod"
                  value={formik.values.startPeriod}
                  onValueChange={(value: "AM" | "PM") =>
                    formik.setFieldValue("startPeriod", value)
                  }
                >
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
                <Select
                  name="endHour"
                  value={formik.values.endHour}
                  onValueChange={(value) => {
                    formik.setFieldValue("endHour", value);
                    formik.setFieldTouched("endHour", true);
                  }}
                >
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

                <Select
                  name="endMinute"
                  value={formik.values.endMinute}
                  onValueChange={(value) => {
                    formik.setFieldValue("endMinute", value);
                    formik.setFieldTouched("endMinute", true);
                  }}
                >
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

                <Select
                  name="endPeriod"
                  value={formik.values.endPeriod}
                  onValueChange={(value: "AM" | "PM") => {
                    formik.setFieldValue("endPeriod", value);
                    formik.setFieldTouched("endPeriod", true);
                  }}
                >
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
            <Alert
              variant="destructive"
              className="bg-red-50 text-red-800 border-red-200"
            >
              <AlertDescription className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                {timeError}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600"
              disabled={
                !formik.isValid ||
                formik.isSubmitting ||
                !formik.values.title ||
                !formik.values.meetingDate ||
                Boolean(timeError)
              }
            >
              <Clock className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}