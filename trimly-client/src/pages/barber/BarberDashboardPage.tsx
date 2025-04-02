import { BarberDashboard } from "@/components/barber/BarberDashboard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export const BarberDashBoardPage = () => {
	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={"barber-dash"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}>
					<BarberDashboard />
				</motion.div>
			</AnimatePresence>
		</>
	);
};
