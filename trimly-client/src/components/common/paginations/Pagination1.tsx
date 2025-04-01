import { motion } from "framer-motion";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPagePrev: () => void;
	onPageNext: () => void;
};

export const Pagination1: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPagePrev,
	onPageNext,
}) => {
	return (
		<motion.div
			className="mt-6 flex justify-center items-center gap-4"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			<motion.button
				className="bg-[var(--yellow)] text-white px-4 py-2 disabled:opacity-60 border-[1px] border-amber-600 rounded-md cursor-pointer"
				disabled={currentPage === 1}
				onClick={onPagePrev}
				whileHover={{ borderRadius: "999px" }}
				whileTap={{ scale: 0.95 }}
				transition={{ duration: 0.3 }}>
				Previous
			</motion.button>
			<motion.span
				className="text-sm text-gray-700 font-medium"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}>
				Page {currentPage} of {totalPages}
			</motion.span>
			<motion.button
				className="bg-[var(--yellow)] text-white px-4 py-2 disabled:opacity-60 border-[1px] border-amber-600 rounded-md cursor-pointer"
				disabled={currentPage === totalPages}
				onClick={onPageNext}
				whileHover={{ borderRadius: "999px" }}
				whileTap={{ scale: 0.95 }}
				transition={{ duration: 0.2 }}>
				Next
			</motion.button>
		</motion.div>
	);
};
