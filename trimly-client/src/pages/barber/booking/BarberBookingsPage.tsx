import { BarberBookingsList } from "@/components/barber/booking/BarberBookingsList";
import { AnimatePresence, motion } from "framer-motion";
export const BarberBookingsPage = () => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={"client-shop-listing"}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
				className="p-4 flex flex-col gap-9 mt-16">
				<BarberBookingsList />
			</motion.div>
		</AnimatePresence>
	);
};
