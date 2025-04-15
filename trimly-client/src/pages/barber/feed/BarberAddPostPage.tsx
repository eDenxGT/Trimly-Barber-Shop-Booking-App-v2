import { PostForm } from "@/components/feed/post/PostForm";
import { useAddPost } from "@/hooks/feed/usePostMutation";
import { useToaster } from "@/hooks/ui/useToaster";
import { IPostFormData } from "@/types/Feed";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const BarberAddPostPage = () => {
  const { mutate: barberAddPost, isPending, isError } = useAddPost();
  const { successToast, errorToast } = useToaster();
  const navigate = useNavigate();

  const handleAddPost = (payload: IPostFormData) => {
    barberAddPost(payload, {
      onSuccess: (data) => {
        successToast(data.message);
        navigate("/barber/my-posts");
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={"add-post"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-18"
        >
          <PostForm
            post={undefined}
            onSubmit={handleAddPost}
            isSubmitting={isPending && !isError}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
