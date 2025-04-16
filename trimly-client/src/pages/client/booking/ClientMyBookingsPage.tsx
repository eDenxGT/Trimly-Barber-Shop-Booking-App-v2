import { BookingHistory } from "@/components/client/booking/BookingHistory";
import { BookingStatus } from "@/components/client/booking/BookingStatus";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useBookingCancelMutation } from "@/hooks/booking/useBookingMutation";
import { useGetAllBookingsByUser } from "@/hooks/booking/useGetAllBookings";
import { useToaster } from "@/hooks/ui/useToaster";
import {
  bookingCancel,
  getBookingsForClient,
} from "@/services/client/clientService";
import { IBooking } from "@/types/Booking";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ClientMyBookingsPage = () => {
  const { data } = useGetAllBookingsByUser(getBookingsForClient);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBookingDetailsDialogOpen, setIsBookingDetailsDialogOpen] =
    useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { successToast, errorToast } = useToaster();
  const navigate = useNavigate();
  const {
    mutate: cancelBooking,
    isPending,
    isError,
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
        setIsBookingDetailsDialogOpen(false);
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"client-shop-listing"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex flex-col gap-9 mt-16"
      >
        <BookingStatus
          bookingData={data?.bookings?.[0] as IBooking}
          handleCancel={handleCancelConfirmation}
          isLoading={isPending && !isError}
        />
        <BookingHistory
          setIsDialogOpen={setIsBookingDetailsDialogOpen}
          isDialogOpen={isBookingDetailsDialogOpen}
          bookings={data?.bookings as IBooking[]}
          handleCancel={handleCancelConfirmation}
        />

        <ConfirmationModal
          title="Do you want to cancel your booking ?"
          description="This action cannot be undone!"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          confirmText="Confirm"
          cancelText="Go Back"
          onConfirm={handleCancelBooking}
        />
      </motion.div>
    </AnimatePresence>
  );
};
