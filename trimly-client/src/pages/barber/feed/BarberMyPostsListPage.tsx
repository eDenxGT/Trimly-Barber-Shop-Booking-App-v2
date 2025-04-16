import { MyPostsList } from "@/components/feed/post/MyPostsList";
import {
  useDeletePost,
  usePostComment,
  useToggleCommentLike,
  useToggleLikePost,
  useUpdatePostStatus,
} from "@/hooks/feed/usePostMutation";
import { useToaster } from "@/hooks/ui/useToaster";
import {
  barberPostComment,
  barberToggleCommentLike,
  barberToggleLikePost,
} from "@/services/barber/barberService";
import { AnimatePresence, motion } from "framer-motion";

export const BarberMyPostsListPage = () => {
  const { mutate: deleteBarberPost } = useDeletePost();
  const { mutate: updateStatus } = useUpdatePostStatus();
  const { mutate: toggleLike } = useToggleLikePost(barberToggleLikePost);
  const { mutate: postComment } = usePostComment(barberPostComment);
  const { mutate: toggleCommentLike } = useToggleCommentLike(
    barberToggleCommentLike
  );
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
    updateStatus(
      {
        postId,
      },
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

  const handleToggleLike = (postId: string) => {
    toggleLike(
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
  const handlePostComment = (postId: string, comment: string) => {
    postComment(
      {
        postId,
        comment,
      },
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

  const handleToggleCommentLike = (commentId: string, postId: string) => {
    toggleCommentLike(
      { commentId, postId },
      {
        onSuccess: () => {
          // successToast(data.message);
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
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
          onToggleCommentLike={handleToggleCommentLike}
          onToggleLike={handleToggleLike}
          onDelete={handleDeletePost}
          onStatusUpdate={handleStatusUpdate}
          onPostComment={handlePostComment}
        />
      </motion.div>
    </AnimatePresence>
  );
};
