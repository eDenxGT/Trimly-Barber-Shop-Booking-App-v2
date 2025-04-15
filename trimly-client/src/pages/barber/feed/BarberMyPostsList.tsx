import { MyPostsList } from "@/components/feed/post/MyPostsList";
import { AnimatePresence, motion } from "framer-motion";

export const BarberMyPostsList = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"add-post"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-18"
      >
        <MyPostsList />
      </motion.div>
    </AnimatePresence>
  );
};
