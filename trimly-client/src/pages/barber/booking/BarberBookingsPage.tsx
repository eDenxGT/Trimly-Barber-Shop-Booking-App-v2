import { BarberBookingsList } from "@/components/barber/booking/BarberBookingsList";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useBookingCompleteMutation } from "@/hooks/booking/useBookingMutation";
import { useGetAllBookingsByUser } from "@/hooks/booking/useGetAllBookings";
import { useToaster } from "@/hooks/ui/useToaster";
import {
	getBookingsForBarber,
	handleBookingCompleteUpdate,
} from "@/services/barber/barberService";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export const BarberBookingsPage = () => {
	const { data, refetch, isFetching, isError } =
		useGetAllBookingsByUser(getBookingsForBarber);
	const { successToast, errorToast } = useToaster();
	const [bookingId, setBookingId] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const { mutate: updateBooking } = useBookingCompleteMutation(
		handleBookingCompleteUpdate
	);

	const handleCompleteConfirmation = (bookingId: string) => {
		setIsModalOpen(true);
		setBookingId(bookingId);
	};

	const handleBookingUpdate = async () => {
		await updateBooking(bookingId as string, {
			onSuccess: (data) => {
				successToast(data.message);
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
				className="p-4 flex flex-col gap-9 mt-16">
				<BarberBookingsList
					refetch={refetch}
					isLoading={isFetching && !isError}
					bookings={data?.bookings || []}
					handleMarkComplete={handleCompleteConfirmation}
				/>
				<ConfirmationModal
					title="Do you completed ?"
					description="This action cannot be undone!"
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					confirmText="Confirm"
					cancelText="Cancel"
					onConfirm={handleBookingUpdate}
				/>
			</motion.div>
		</AnimatePresence>
	);
};
