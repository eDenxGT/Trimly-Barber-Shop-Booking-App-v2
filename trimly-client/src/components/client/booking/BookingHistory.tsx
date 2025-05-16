import { useState } from "react";
import { Eye, Calendar, Clock, MapPin, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBooking } from "@/types/Booking";
import MuiButton from "@/components/common/buttons/MuiButton";
import { useNavigate } from "react-router-dom";
import { openInGoogleMap } from "@/utils/helpers/googleMapRedirect";
import { ReviewModal } from "@/components/modals/ReviewModal";

export function BookingHistory({
  bookings = [],
  handleCancel,
  isDialogOpen,
  setIsDialogOpen,
}: {
  bookings: IBooking[];
  handleCancel: (bookingId: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === "all") return true;
    return booking?.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const viewBookingDetails = (booking: IBooking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl p-4 md:p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking History</h2>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="bg-white shadow-sm py-0 overflow-hidden border border-gray-100">
        <CardContent className="p-0">
          {!bookings || filteredBookings?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-sm mt-1">
                {activeTab === "all"
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${activeTab} bookings.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto no-scrollbar max-h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Shop</TableHead>
                    <TableHead className="font-semibold">Services</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings?.map((booking) => (
                    <TableRow
                      key={booking.bookingId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 hidden sm:flex items-center justify-center">
                            {booking.shopDetails?.avatar ? (
                              <img
                                src={booking.shopDetails.avatar}
                                alt={booking.shopDetails?.shopName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-xs text-gray-400 font-medium">
                                Shop
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {booking.shopDetails?.shopName || "Unknown Shop"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.shopDetails?.location?.name ||
                                "Unknown location"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {booking.servicesDetails?.map((service, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-50 text-xs"
                            >
                              {service.name || ""}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          <div className="font-medium text-gray-700">
                            {formatDate(booking.date)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.startTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(booking?.status || "")}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        ₹{booking?.total?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {selectedBooking?.shopDetails?.avatar ? (
                    <img
                      src={selectedBooking?.shopDetails?.avatar}
                      alt={selectedBooking?.shopDetails?.shopName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-lg text-gray-400 font-medium">
                      Shop
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedBooking?.shopDetails?.shopName}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {selectedBooking?.shopDetails?.location?.displayName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-gray-500">Booking ID</div>
                  <div className="font-medium">
                    {selectedBooking?.bookingId?.slice(0, 27) + "..." || ""}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Status</div>
                  <Badge
                    className={getStatusColor(selectedBooking?.status || "")}
                  >
                    {selectedBooking?.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Date</div>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedBooking?.date || "")}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Time</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedBooking?.startTime}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Location</div>
                  <div className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedBooking?.shopDetails?.location?.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Navigate</div>
                  <MuiButton
                    variant="darkblue"
                    onClick={() =>
                      openInGoogleMap(
                        selectedBooking?.shopDetails?.location
                          ?.coordinates?.[1],
                        selectedBooking?.shopDetails?.location?.coordinates?.[0]
                      )
                    }
                    className=" flex justify-center items-center gap-1.5"
                  >
                    <Map size={15} />
                    Goto Maps
                  </MuiButton>
                </div>

                <div className="space-y-2 col-span-2 pt-2 border-t">
                  <div className="text-gray-500">Services</div>
                  <div className="space-y-2">
                    {selectedBooking?.servicesDetails?.map((service, index) => (
                      <div
                        key={service.serviceId || index}
                        className="flex justify-between"
                      >
                        <span>{service.name}</span>
                        <span className="font-medium">
                          ₹{service?.price?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span className="font-medium">₹5</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">
                        ₹{selectedBooking?.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                {(selectedBooking?.status === "confirmed" ||
                  selectedBooking?.status === "pending") && (
                  <MuiButton
                    onClick={() =>
                      handleCancel(selectedBooking?.bookingId as string)
                    }
                    variant="darkblue"
                  >
                    Cancel
                  </MuiButton>
                )}
                {(selectedBooking?.status === "completed" ||
                  selectedBooking?.status) === "cancelled" && (
                  <div className="flex gap-3">
                    <MuiButton
                      onClick={() => setIsReviewModalOpen(true)}
                      variant="darkblue"
                    >
                      Rate It
                    </MuiButton>
                    <MuiButton
                      onClick={() =>
                        navigate(
                          `/shops/${selectedBooking?.shopDetails?.userId}/booking`
                        )
                      }
                    >
                      Book Again
                    </MuiButton>
                  </div>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        shopId={selectedBooking?.shopDetails?.userId || ""}
      />
    </div>
  );
}
