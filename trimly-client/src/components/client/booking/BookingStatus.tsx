import { useState } from "react";
import { MapPin, MessageCircle, Calendar, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IBooking } from "@/types/Booking";
import MuiButton from "@/components/common/buttons/MuiButton";
import { openInGoogleMap } from "@/utils/helpers/googleMapRedirect";
import { ReviewModal } from "@/components/modals/ReviewModal";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MdCancel } from "react-icons/md";

export function BookingStatus({
  bookingData,
  handleCancel,
  isLoading,
}: {
  isLoading: boolean;
  bookingData: IBooking;
  handleCancel: (bookingId: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep] = useState(
    bookingData?.status === "completed"
      ? "finished"
      : bookingData?.status === "cancelled"
      ? "cancelled"
      : bookingData?.status === "confirmed"
      ? "in-process"
      : "booked"
  );

  const navigate = useNavigate();

  const steps = [
    { id: "booked", label: "Booked", icon: "📋" },
    { id: "in-process", label: "In-Process", icon: "✂️" },
    { id: "finished", label: "Finished", icon: "✓" },
  ];

  const isCancelled = bookingData?.status === "cancelled";

  const getProgressPercentage = () => {
    if (isCancelled) return 100;
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    return currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;
  };

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const formatBookingDate = (date: Date) => {
    if (!date) return "";
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-200 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Status Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Your Last Booking Status
          </h2>

          {/* Progress Tracker using shadcn Progress */}
          <div className="space-y-4">
            <Progress
              value={getProgressPercentage()}
              className="h-1 bg-gray-300"
              // indicatorClassName={isCancelled ? "bg-red-500" : "bg-blue-600"}
            />

            <div className="flex justify-between items-center">
              {isCancelled ? (
                // Show cancelled status
                <div className="flex-1 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <span className="">
                        <MdCancel />
                      </span>
                    </div>
                    <span className="text-xs mt-1 font-medium">Cancelled</span>
                  </div>
                </div>
              ) : (
                // Show normal progress steps
                steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${
                          index <= currentStepIndex
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300"
                        }`}
                    >
                      <span className="text-xs">{step.icon}</span>
                    </div>
                    <span className="text-xs mt-1 font-medium">
                      {step.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Booking Card */}
          <Card className="bg-white shadow-sm py-2">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={bookingData?.shopDetails?.avatar}
                    alt="Barbershop"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">
                    {bookingData?.shopDetails?.shopName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {bookingData?.shopDetails?.location?.name}
                  </p>

                  {/* Enhanced booking details */}
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatBookingDate(bookingData?.date)},{" "}
                        {bookingData?.startTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CircleDot className="h-3 w-3 text-green-500" />
                      <span className="font-medium">₹{bookingData?.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services list */}
              {/* {bookingData?.servicesDetails?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Services:</p>
                  <ul className="text-sm space-y-1">
                    {bookingData.servicesDetails.map((service, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{service.name}</span>
                        <span className="font-medium">₹{service.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              <div className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() =>
                        openInGoogleMap(
                          bookingData?.shopDetails?.location?.coordinates?.[1],
                          bookingData?.shopDetails?.location?.coordinates?.[0]
                        )
                      }
                      className="w-8 h-8 rounded-full hover:cursor-pointer bg-green-100 hover:text-green-700 hover:bg-green-200 flex items-center justify-center"
                    >
                      <MapPin className="h-4 w-4 text-green-600" />
                    </button>
                    <span className="text-xs mt-1">Navigate</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/chat?userId=${
                            bookingData?.shopDetails?.userId || ""
                          }&type=dm`
                        )
                      }
                      className="w-8 h-8 rounded-full cursor-pointer bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center"
                    >
                      <MessageCircle className="h-4 w-4 text-indigo-600" />
                    </button>
                    <span className="text-xs mt-1">Chat</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {bookingData?.status === "confirmed" ||
                  bookingData?.status === "pending" ? (
                    <MuiButton
                      loading={isLoading}
                      onClick={() => handleCancel(bookingData.bookingId || "")}
                      variant="darkblue"
                      className="h-10 text-white"
                    >
                      Cancel
                    </MuiButton>
                  ) : (
                    bookingData?.status === "completed" || bookingData?.status === "cancelled" && (
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        variant="outline"
                        className="bg-indigo-900 text-white hover:bg-indigo-800"
                      >
                        Rate
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Find Salon Section */}
        <div className="space-y-4 max-h-79">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Find Shop In Map
          </h2>
          <div className="h-full rounded-lg overflow-hidden">
            {bookingData?.shopDetails?.location?.coordinates ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                loading="lazy"
                src={`https://www.google.com/maps?q=${bookingData?.shopDetails?.location?.coordinates[1]},${bookingData?.shopDetails?.location?.coordinates[0]}&output=embed`}
              />
            ) : (
              <div className="h-full bg-gray-200 flex items-center justify-center rounded-lg">
                <MapPin className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-gray-500">Map View</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={bookingData?.shopDetails?.userId || ""}
      />
    </div>
  );
}
