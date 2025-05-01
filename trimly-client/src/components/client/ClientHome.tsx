import { Button } from "@/components/ui/button";
import HeroCarousel from "./home/HeroCarousel";
import { BarberShopCard } from "../common/cards/BarberShopCard";
import { useNavigate } from "react-router-dom";
import { IBarber } from "@/types/User";
import { IBooking } from "@/types/Booking";
import { BookingStatus } from "./booking/BookingStatus";
import { BarberShopCardSkeleton } from "../common/skeletons/BarberShopCardSkeleton";
import { useState } from "react";
import { useToaster } from "@/hooks/ui/useToaster";
import { bookingCancel } from "@/services/client/clientService";
import { useBookingCancelMutation } from "@/hooks/booking/useBookingMutation";
import { ConfirmationModal } from "../modals/ConfirmationModal";

export function ClientHome({
  shops,
  booking,
  permissionDenied,
  getLocation,
  isLoading,
}: {
  shops: IBarber[];
  booking: IBooking;
  permissionDenied: boolean;
  isLoading: boolean;
  getLocation: () => void;
}) {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { successToast, errorToast } = useToaster();
  const {
    mutate: cancelBooking,
    isPending: isCancelBookingPending,
    isError: isCancelBookingError,
  } = useBookingCancelMutation(bookingCancel);

  const handleCancelConfirmation = (bookingId: string) => {
    setIsModalOpen(true);
    setBookingId(bookingId);
  };

  const handleCancelBooking = async () => {
    await cancelBooking(bookingId as string, {
      onSuccess: (data) => {
        successToast(data.message);
        navigate("/my-bookings");
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh]">
        <HeroCarousel />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Premium Barber Experience
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
            Book your next haircut with the best barbers in your town
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <Button className="bg-[#feba43] hover:bg-[#e5a93c] text-black font-semibold px-8 py-6 text-lg">
              Book Now
            </Button> */}
            <Button
              onClick={() => navigate("/shops")}
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/20 hover:text-white px-8 py-6 text-lg"
            >
              Explore Shops
            </Button>
          </div>
        </div>
      </section>

      {permissionDenied ? (
        <div className="text-center mt-10">
          <p className="text-red-500 font-medium mb-2">
            Location permission is needed to show nearby shops.
          </p>
          <button
            onClick={getLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top Rated Nearby Shops</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, idx) => (
                <BarberShopCardSkeleton key={idx} />
              ))}
            </div>
          ) : shops && shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shops.map((shop) => (
                <BarberShopCard key={shop.userId} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          )}
        </section>
      )}

      {/* Last Booking Status Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Your Last Booking</h2>
        <BookingStatus
          bookingData={booking}
          handleCancel={handleCancelConfirmation}
          isLoading={
            isLoading || (isCancelBookingPending && !isCancelBookingError)
          }
        />
      </section>
      <ConfirmationModal
        title="Do you want to cancel your booking ?"
        description="This action cannot be undone!"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmText="Confirm"
        cancelText="Go Back"
        onConfirm={handleCancelBooking}
      />
    </main>
  );
}
