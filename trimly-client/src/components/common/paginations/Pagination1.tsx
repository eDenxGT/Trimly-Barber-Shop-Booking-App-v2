
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationCompactProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination1({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationCompactProps) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </motion.div>
  );
}
