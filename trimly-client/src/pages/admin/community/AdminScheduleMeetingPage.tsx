import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { format, isAfter, addHours } from "date-fns";
import { CalendarIcon, Clock, Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { meetingSchema } from "@/utils/validations/meeting.validator";
import { useScheduleMeeting } from "@/hooks/meeting/useMeetingRoom";
import { IMeetingRoom } from "@/types/Chat";
import { useToaster } from "@/hooks/ui/useToaster";
import { convertTo12Hour, convertTo24Hour } from "@/utils/helpers/timeFormatter";

export const AdminScheduleMeetingPage = () => {
  const isLoading = false;
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { communityId } = useParams();
  const [timeError, setTimeError] = useState("");
  const navigate = useNavigate();

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

    if (isAfter(startTime, endTime) || startTime.getTime() === endTime.getTime()) {
      setTimeError("End time must be after start time");
      return false;
    }

    setTimeError("");
    return true;
  };

  const { successToast, errorToast } = useToaster();

  const { mutate: scheduleMeet } = useScheduleMeeting();

  const handleScheduleMeeting = (data: Partial<IMeetingRoom>) => {
    scheduleMeet(data, {
      onSuccess: (data) => {
        successToast(data.message);
        navigate(`/admin/communities`);
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };
  
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      meetLink: "",
      meetingDate: null as Date | null,
      startHour: "9",
      startMinute: "00",
      startPeriod: "AM",
      endHour: "10",
      endMinute: "00",
      endPeriod: "AM",
    },
    validationSchema: meetingSchema,
    onSubmit: async (values) => {
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

      const startDate = new Date(values.meetingDate!);
      startDate.setHours(
        Number.parseInt(startHour24),
        Number.parseInt(startMinute),
        0
      );

      const endDate = new Date(values.meetingDate!);
      endDate.setHours(
        Number.parseInt(endHour24),
        Number.parseInt(endMinute),
        0
      );

      const meetingData = {
        title: values.title,
        description: values.description,
        startTime: startDate,
        endTime: endDate,
        meetLink: values.meetLink,
        communityId: communityId,
      };

      handleScheduleMeeting(meetingData);
    },
  });

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const minuteOptions = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );

  const suggestEndTime = () => {
    if (!formik.values.meetingDate) return;

    const { hour: startHour24, minute: startMinute } = convertTo24Hour(
      formik.values.startHour,
      formik.values.startMinute,
      formik.values.startPeriod
    );

    const startTime = new Date(formik.values.meetingDate);
    startTime.setHours(
      Number.parseInt(startHour24),
      Number.parseInt(startMinute),
      0
    );

    const suggestedEndTime = addHours(startTime, 1);
    const endHour = suggestedEndTime.getHours();
    const endMinute = suggestedEndTime.getMinutes();

    const { hour, period } = convertTo12Hour(endHour.toString());

    formik.setFieldValue("endHour", hour);
    formik.setFieldValue("endMinute", endMinute.toString().padStart(2, "0"));
    formik.setFieldValue("endPeriod", period);
  };

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
    if (formik.values.meetingDate) {
      suggestEndTime();
    }
  }, [formik.values.meetingDate]);

  return (
    <div className="container mx-auto py-8 mt-16 px-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-t-4 py-0 border-t-yellow-500">
          <CardHeader className="bg-gradient-to-r py-3 from-yellow-50 to-yellow-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 border-yellow-300"
              >
                New Meeting
              </Badge>
            </div>
            <h2 className="text-xl font-semibold mt-2">Meeting Details</h2>
            <p className="text-sm text-muted-foreground">
              Fill out the form to schedule a new meeting
            </p>
          </CardHeader>

          <form onSubmit={formik.handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  Meeting Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter meeting title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "transition-all duration-200",
                    formik.touched.title && formik.errors.title
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                  )}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-sm text-red-500">
                    {formik.errors.title as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="meetLink"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  Meeting Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meetLink"
                  name="meetLink"
                  placeholder="https://meet.google.com"
                  value={formik.values.meetLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "transition-all duration-200",
                    formik.touched.meetLink && formik.errors.meetLink
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                  )}
                />
                {formik.touched.meetLink && formik.errors.meetLink && (
                  <p className="text-sm text-red-500">
                    {formik.errors.meetLink as string}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  Description
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Provide details about the meeting agenda, required
                          preparation, or any other relevant information.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter meeting description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[100px] focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                />
              </div>

              {/* Date Field */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  Meeting Date <span className="text-red-500">*</span>
                </Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !formik.values.meetingDate && "text-muted-foreground",
                        formik.touched.meetingDate &&
                          formik.errors.meetingDate &&
                          "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formik.values.meetingDate ? (
                        format(formik.values.meetingDate, "EEEE, MMMM d, yyyy")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formik.values.meetingDate}
                      onSelect={(date) => {
                        formik.setFieldValue("meetingDate", date);
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                      className="rounded-md border"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.meetingDate && formik.errors.meetingDate && (
                  <p className="text-sm text-red-500">
                    {formik.errors.meetingDate as string}
                  </p>
                )}
              </div>

              {/* Time Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        name="startHour"
                        value={formik.values.startHour}
                        onValueChange={(value) => {
                          formik.setFieldValue("startHour", value);
                          if (formik.values.meetingDate) {
                            suggestEndTime();
                          }
                        }}
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
                      <span>:</span>
                      <Select
                        name="startMinute"
                        value={formik.values.startMinute}
                        onValueChange={(value) => {
                          formik.setFieldValue("startMinute", value);
                          if (formik.values.meetingDate) {
                            suggestEndTime();
                          }
                        }}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {minuteOptions.map((minute) => (
                            <SelectItem
                              key={`start-minute-${minute}`}
                              value={minute}
                            >
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        name="startPeriod"
                        value={formik.values.startPeriod}
                        onValueChange={(value) => {
                          formik.setFieldValue("startPeriod", value);
                          if (formik.values.meetingDate) {
                            suggestEndTime();
                          }
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

                  {/* End Time */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      End Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        name="endHour"
                        value={formik.values.endHour}
                        onValueChange={(value) => {
                          formik.setFieldValue("endHour", value);
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
                      <span>:</span>
                      <Select
                        name="endMinute"
                        value={formik.values.endMinute}
                        onValueChange={(value) => {
                          formik.setFieldValue("endMinute", value);
                        }}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {minuteOptions.map((minute) => (
                            <SelectItem
                              key={`end-minute-${minute}`}
                              value={minute}
                            >
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        name="endPeriod"
                        value={formik.values.endPeriod}
                        onValueChange={(value) => {
                          formik.setFieldValue("endPeriod", value);
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

                {formik.values.meetingDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-yellow-50 p-3 rounded-md border border-yellow-200"
                  >
                    <p className="text-sm text-yellow-800 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>
                        Meeting scheduled for{" "}
                        <strong>
                          {format(
                            formik.values.meetingDate,
                            "EEEE, MMMM d, yyyy"
                          )}
                        </strong>{" "}
                        from{" "}
                        <strong>
                          {formik.values.startHour}:{formik.values.startMinute}{" "}
                          {formik.values.startPeriod}
                        </strong>{" "}
                        to{" "}
                        <strong>
                          {formik.values.endHour}:{formik.values.endMinute}{" "}
                          {formik.values.endPeriod}
                        </strong>
                      </span>
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-zinc-50 rounded-b-lg flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">*</span> Required fields
              </p>
              {isLoading ? (
                <div className="space-y-2 w-full max-w-[200px]">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    !formik.isValid || 
                    formik.isSubmitting || 
                    !!timeError ||
                    !formik.values.title ||
                    !formik.values.meetLink ||
                    !formik.values.meetingDate
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};