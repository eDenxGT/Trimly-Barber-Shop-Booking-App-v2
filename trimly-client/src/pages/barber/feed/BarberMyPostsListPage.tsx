import { MyPostsList } from "@/components/feed/post/MyPostsList";
import { useDeletePost } from "@/hooks/feed/usePostMutation";
import { useToaster } from "@/hooks/ui/useToaster";
import { AnimatePresence, motion } from "framer-motion";

export const BarberMyPostsListPage = () => {
  const { mutate: deleteBarberPost } = useDeletePost();
  const { successToast, errorToast } = useToaster();

  const handleDeletePost = (postId: string) => {
    deleteBarberPost(
      { postId },
      {
        onSuccess: (data) => {
          successToast(data.message);
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  const handleStatusUpdate = (postId: string) => {
    console.log("Updating", postId);
  };

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
        <MyPostsList
          onDelete={handleDeletePost}
          onStatusUpdate={handleStatusUpdate}
        />
      </motion.div>
    </AnimatePresence>
  );
};
