import { BookingHistory } from "@/components/client/booking/BookingHistory";
import { BookingStatus } from "@/components/client/booking/BookingStatus";
import { AnimatePresence, motion } from "framer-motion";

export const ClientMyBookingsPage = () => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={"client-shop-listing"}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
				className="p-4 flex flex-col gap-9 mt-16">
				<BookingStatus />
				<BookingHistory />
			</motion.div>
		</AnimatePresence>
	);
};
