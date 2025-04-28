import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import {
  CalendarIcon,
  Check,
  Calendar as CalendarFull,
  List,
  Grid,
  Info,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBooking } from "@/types/Booking";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/common/skeletons/BarberBookingsSkeleton";
import { EmptyState } from "./EmptyState";
import { BookingCard } from "@/components/common/cards/BookingCard";
import { BookingDetailsDialog } from "@/components/modals/BookingDetailsModal";

const statusConfig = {
  confirmed: {
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    icon: null,
  },
  pending: {
    className:
      "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
    icon: null,
  },
  cancelled: {
    className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    icon: null,
  },
  completed: {
    className:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
    icon: <Check className="h-3 w-3 mr-1" />,
  },
};

type StatusFilter = "all" | "confirmed" | "pending" | "cancelled" | "completed";

export function BarberBookingsList({
  bookings,
  refetch,
  isLoading,
  handleMarkComplete,
}: {
  bookings: IBooking[];
  refetch: () => void;
  isLoading: boolean;
  handleMarkComplete: (bookingId: string) => void;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [filteredBookings, setFilteredBookings] = useState<IBooking[]>([]);
  const [dateFilteredBookings, setDateFilteredBookings] = useState<IBooking[]>(
    []
  );
  const [viewMode, setViewMode] = useState<"grid" | "list" | "timeline">(
    "grid"
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("confirmed");
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookings || bookings.length === 0) {
      setDateFilteredBookings([]);
      return;
    }

    const filtered = bookings.filter((booking) => {
      const bookingDate =
        booking.date instanceof Date ? booking.date : new Date(booking.date);
      return isSameDay(bookingDate, date);
    });

    setDateFilteredBookings(filtered);
  }, [bookings, date]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(dateFilteredBookings);
    } else {
      setFilteredBookings(
        dateFilteredBookings.filter(
          (booking) => booking.status === statusFilter
        )
      );
    }
  }, [dateFilteredBookings, statusFilter]);

  const refreshData = () => {
    refetch();
  };

  const markAsFinished = (bookingId: string) => {
    handleMarkComplete(bookingId);
  };

  const messageClient = (userId: string) => {
    navigate(`/barber/chat?userId=${userId}&type=dm`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full hover:cursor-pointer hover:bg-yellow-100"
              >
                <ArrowLeft className="h-5 w-5 text-yellow-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                  Bookings
                </h1>
                <p className="text-slate-500 text-sm">Appointment Management</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto justify-start text-left font-normal border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900",
                      !date && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[var(--yellow)]" />
                    {date ? (
                      format(date, "EEEE, MMMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="rounded-md border-indigo-200"
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="icon"
                onClick={refreshData}
                disabled={isLoading}
                className="text-slate-600 hover:text-[var(--yellow)] hover:bg-indigo-50"
              >
                <RefreshCw
                  className={cn("h-5 w-5", isLoading && "animate-spin")}
                />
              </Button>

              <div className="bg-slate-100 rounded-lg p-1 ml-auto md:ml-0">
                <Tabs defaultValue={viewMode} value={viewMode}>
                  <TabsList className="grid grid-cols-3 h-8 w-auto">
                    <TabsTrigger
                      value="grid"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        viewMode === "grid" &&
                          "bg-white shadow-sm text-[var(--yellow)]"
                      )}
                    >
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        viewMode === "list" &&
                          "bg-white shadow-sm text-[var(--yellow)]"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="timeline"
                      onClick={() => setViewMode("timeline")}
                      className={cn(
                        viewMode === "timeline" &&
                          "bg-white shadow-sm text-[var(--yellow)]"
                      )}
                    >
                      <CalendarFull className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4 md:px-6">
        {isLoading ? (
          <LoadingState viewMode={viewMode} />
        ) : dateFilteredBookings.length === 0 ? (
          <EmptyState date={date} setDate={setDate} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-medium text-slate-700">
                {filteredBookings.length} Appointments •{" "}
                {format(date, "MMMM d, yyyy")}
              </h2>

              {/* Status filter tabs */}
              <Tabs
                defaultValue="all"
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-5 h-9 bg-slate-100 p-1">
                  <TabsTrigger
                    value="all"
                    className={cn(
                      "text-xs",
                      statusFilter === "all" && "bg-white shadow-sm"
                    )}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="confirmed"
                    className={cn(
                      "text-xs",
                      statusFilter === "confirmed" && "bg-white shadow-sm"
                    )}
                  >
                    Confirmed
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className={cn(
                      "text-xs",
                      statusFilter === "pending" && "bg-white shadow-sm"
                    )}
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className={cn(
                      "text-xs",
                      statusFilter === "completed" && "bg-white shadow-sm"
                    )}
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className={cn(
                      "text-xs",
                      statusFilter === "cancelled" && "bg-white shadow-sm"
                    )}
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="rounded-full bg-slate-100 p-3 mb-4">
                  <Info className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  No {statusFilter !== "all" ? statusFilter : ""} appointments
                </h3>
                <p className="text-slate-500 mt-1 mb-4 max-w-md">
                  {statusFilter !== "all"
                    ? `There are no ${statusFilter} appointments for ${format(
                        date,
                        "MMMM d, yyyy"
                      )}.`
                    : `There are no appointments for ${format(
                        date,
                        "MMMM d, yyyy"
                      )}.`}
                </p>
                <Button
                  onClick={() => setStatusFilter("all")}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Show all appointments
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking.bookingId}
                        statusConfig={statusConfig}
                        booking={booking}
                        markAsFinished={markAsFinished}
                        messageClient={messageClient}
                      />
                    ))}
                  </div>
                )}

                {viewMode === "list" && (
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-xs font-medium text-slate-500 uppercase">
                              Time
                            </TableHead>
                            <TableHead className="text-xs font-medium text-slate-500 uppercase">
                              Client
                            </TableHead>
                            <TableHead className="text-xs font-medium text-slate-500 uppercase">
                              Services
                            </TableHead>
                            <TableHead className="text-xs font-medium text-slate-500 uppercase">
                              Total
                            </TableHead>
                            <TableHead className="text-xs font-medium text-slate-500 uppercase">
                              Status
                            </TableHead>
                            <TableHead className="text-xs font-medium text-slate-500 uppercase text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking) => (
                            <TableRow
                              key={booking.bookingId}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <TableCell className="py-3">
                                <div className="font-medium text-slate-900">
                                  {booking.startTime}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  {booking.duration} min
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2.5 border border-slate-200">
                                    {booking?.clientDetails?.avatar ? (
                                      <AvatarImage
                                        src={booking?.clientDetails?.avatar}
                                        alt={booking?.clientDetails?.fullName}
                                      />
                                    ) : null}
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                      {booking?.clientDetails?.fullName.charAt(
                                        0
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {booking?.clientDetails?.fullName}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                      {booking?.clientDetails?.phoneNumber}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-slate-900">
                                <div className="space-y-1">
                                  {booking?.servicesDetails?.map(
                                    (service, idx) => (
                                      <div key={idx}>{service.name}</div>
                                    )
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-slate-900">
                                ${booking.total}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "capitalize text-xs px-2 py-0.5",
                                    statusConfig[booking?.status || "pending"]
                                      .className
                                  )}
                                >
                                  {
                                    statusConfig[booking?.status || "pending"]
                                      .icon
                                  }
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right space-x-2 whitespace-nowrap">
                                <BookingDetailsDialog
                                  statusConfig={statusConfig}
                                  booking={booking}
                                  messageClient={messageClient}
                                />

                                {booking.status !== "completed" &&
                                  booking.status !== "cancelled" && (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        markAsFinished(booking.bookingId || "")
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {viewMode === "timeline" && (
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <div className="relative">
                      <div className="absolute left-9 top-0 bottom-0 w-px bg-slate-200"></div>
                      <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                          <div
                            key={booking.bookingId}
                            className="relative flex gap-4"
                          >
                            <div className="absolute left-0 w-18 text-right text-sm font-medium text-slate-700 pt-0.5">
                              {booking.startTime}
                            </div>
                            <div
                              className={cn(
                                "absolute left-9 top-1 w-2.5 h-2.5 rounded-full -translate-x-1/2 z-10",
                                booking.status === "cancelled"
                                  ? "bg-red-500"
                                  : booking.status === "completed"
                                  ? "bg-emerald-500"
                                  : booking.status === "pending"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              )}
                            ></div>
                            <div className="ml-20 flex-1">
                              <div
                                className={cn(
                                  "bg-white rounded-lg border p-4 transition-all",
                                  booking.status === "cancelled"
                                    ? "border-red-200"
                                    : booking.status === "completed"
                                    ? "border-emerald-200"
                                    : booking.status === "pending"
                                    ? "border-amber-200"
                                    : "border-blue-200"
                                )}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {booking?.servicesDetails
                                        ?.map((s) => s.name)
                                        .join(", ")}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                      {booking?.clientDetails?.fullName} •{" "}
                                      {booking.duration} min
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "capitalize text-xs px-2 py-0.5",
                                      statusConfig[booking?.status || "pending"]
                                        .className
                                    )}
                                  >
                                    {
                                      statusConfig[booking?.status || "pending"]
                                        .icon
                                    }
                                    {booking.status}
                                  </Badge>
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                  <BookingDetailsDialog
                                    statusConfig={statusConfig}
                                    booking={booking}
                                    messageClient={messageClient}
                                    useIconButton
                                  />
                                  {booking.status !== "completed" &&
                                    booking.status !== "cancelled" && (
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          markAsFinished(
                                            booking.bookingId || ""
                                          )
                                        }
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 ml-auto"
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Complete
                                      </Button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
