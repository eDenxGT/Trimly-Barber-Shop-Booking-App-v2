import { AdminDashboard } from "@/components/admin/AdminDasboard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export const AdminDashBoardPage = () => {
	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={"admin-dash"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}>
					<AdminDashboard />
				</motion.div>
			</AnimatePresence>
		</>
	);
};
