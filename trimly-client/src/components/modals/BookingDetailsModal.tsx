import { Check, Info, MessageSquare, Phone } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IBooking } from "@/types/Booking";

export function BookingDetailsDialog({
  booking,
  messageClient,
  useIconButton = false,
  statusConfig,
}: {
  booking: IBooking;
  messageClient: (userId: string) => void;
  useIconButton?: boolean;
  statusConfig: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {useIconButton ? (
          <Button
            size="sm"
            variant="outline"
            className="text-slate-600 hover:text-indigo-600 h-8"
          >
            <Info className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          >
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Complete information about this booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Client Info */}
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border border-slate-200">
              {booking?.clientDetails?.avatar ? (
                <AvatarImage
                  src={booking?.clientDetails.avatar}
                  alt={booking.clientDetails.fullName}
                />
              ) : null}
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                {booking?.clientDetails?.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-slate-800">
                {booking?.clientDetails?.fullName}
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <Phone className="h-3.5 w-3.5 mr-1" />
                {booking?.clientDetails?.phoneNumber}
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Date</div>
              <div className="font-medium">
                {booking.date instanceof Date
                  ? format(booking.date, "MMMM d, yyyy")
                  : format(new Date(booking.date), "MMMM d, yyyy")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Time</div>
              <div className="font-medium">
                {booking.startTime} ({booking.duration} min)
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Total</div>
              <div className="font-medium">₹{booking.total}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Status</div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize text-xs",
                  statusConfig[booking?.status || "pending"].className
                )}
              >
                {statusConfig[booking?.status || "pending"].icon}
                {booking.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Services Details */}
          <div className="space-y-2">
            <div className="text-sm text-slate-500">Services</div>
            <div className="bg-slate-50 rounded-md p-3 space-y-2">
              {booking?.servicesDetails?.map((service, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-800">
                      {service.name}
                    </div>
                  </div>
                  <div className="font-medium">₹{service.price}</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-semibold">
                <div>Total</div>
                <div>₹{booking.total}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            size="sm"
            onClick={() => messageClient(booking?.clientDetails?.userId || "")}
            className="text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Message Client
          </Button>

          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <Button
              size="sm"
              // onClick={() =>
              // 	// markAsFinished(booking.bookingId || "")
              // }
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Mark Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
