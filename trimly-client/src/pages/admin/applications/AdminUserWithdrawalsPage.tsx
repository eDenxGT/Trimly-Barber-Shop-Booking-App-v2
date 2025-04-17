import { AdminUserWithdrawalRequests } from "@/components/admin/applications/AdminUserWithdrawalRequests";
import { AnimatePresence, motion } from "framer-motion";

export const AdminUserWithdrawalsPage = () => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={"user-withdrawals"}
            className="mt-17"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}>
				<AdminUserWithdrawalRequests />
			</motion.div>
		</AnimatePresence>
	);
};
