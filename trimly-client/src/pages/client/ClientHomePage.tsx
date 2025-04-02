import ClientHome from "@/components/client/ClientHome";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export const ClientHomePage = () => {
	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={"client-home"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}>
					<ClientHome />
				</motion.div>
			</AnimatePresence>
		</>
	);
};
