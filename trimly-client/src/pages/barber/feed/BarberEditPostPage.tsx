import { PostForm } from "@/components/feed/post/PostForm";
import { useLoading } from "@/hooks/common/useLoading";
import { useGetPostByPostId } from "@/hooks/feed/useGetPosts";
import { useEditPost } from "@/hooks/feed/usePostMutation";
import { useToaster } from "@/hooks/ui/useToaster";
import { fetchPostByPostIdForBarbers } from "@/services/barber/barberService";
import { IPostFormData } from "@/types/Feed";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BarberEditPostPage = () => {
  const { postId } = useParams();
  const { setLoadingState } = useLoading();
  const navigate = useNavigate();
  const { successToast, errorToast } = useToaster();

  const { data, isLoading, isError } = useGetPostByPostId(
    fetchPostByPostIdForBarbers,
    postId || "",
    "edit"
  );

  const {
    mutate: barberEditPost,
    isPending,
    isError: mutateError,
  } = useEditPost();

  const handleEditPost = (payload: IPostFormData) => {
    barberEditPost(
      { payload, postId: postId || "" },
      {
        onSuccess: (data) => {
          successToast(data.message);
          navigate("/barber/my-posts");
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    setLoadingState(isLoading && !isError);
  }, [isLoading, isError, setLoadingState]);
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={"edit-post"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-18"
        >
          <PostForm
            post={data?.post}
            onSubmit={handleEditPost}
            isSubmitting={isPending && !mutateError}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
