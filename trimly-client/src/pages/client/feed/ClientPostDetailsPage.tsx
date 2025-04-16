import { CommentsSection } from "@/components/feed/comment/CommentSection";
import { PostDetailsFooter } from "@/components/feed/post/details/PostDetailsFooter";
import { PostHeader } from "@/components/feed/post/PostHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetPostByPostId } from "@/hooks/feed/useGetPosts";
import {
  usePostComment,
  useToggleCommentLike,
  useToggleLikePost,
} from "@/hooks/feed/usePostMutation";
import { useToaster } from "@/hooks/ui/useToaster";
import {
  clientPostComment,
  clientToggleCommentLike,
  clientToggleLikePost,
  fetchPostByPostIdForClients,
} from "@/services/client/clientService";
import { IClient } from "@/types/User";
import { handlePostShare } from "@/utils/helpers/shareLink";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

export function ClientPostDetailsPage() {
  const { postId } = useParams();
  const [newComment, setNewComment] = useState<string>("");
  const user = useOutletContext<IClient>();
  const navigate = useNavigate();
  const { mutate: toggleLike } = useToggleLikePost(clientToggleLikePost);
  const { mutate: postComment } = usePostComment(clientPostComment);
  const { mutate: toggleCommentLike } = useToggleCommentLike(
    clientToggleCommentLike
  );
  const { successToast, errorToast } = useToaster();

  const { data, isLoading, isError } = useGetPostByPostId(
    fetchPostByPostIdForClients,
    postId || "",
    "details"
  );

  const handleToggleLike = (postId: string) => {
    toggleLike(
      { postId },
      {
        onSuccess: () => {
          //   successToast(data.message);
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

  const handleToggleCommentLike = (commentId: string) => {
    toggleCommentLike(
      { commentId, postId: postId || "" },
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

  const post = data?.post;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-lg font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-red-500">Failed to load post</p>
        <Button onClick={() => navigate(-1)}>Return to Home</Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"client-post-details"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="min-h-screen mt-17 bg-white">
          <div className="container mx-auto">
            <div className="flex max-h-[88vh] flex-col md:flex-row md:h-[calc(100vh-2rem)] max-w-6xl mx-auto my-4 border rounded-lg overflow-hidden">
              {/* Left - Image */}

              <div className="md:w-3/5 bg-black flex items-center justify-center">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.caption}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              {/* Right - Info & Comments */}
              <div className="md:w-2/5 flex flex-col h-full max-h-[90vh] bg-white">
                {/* Header */}
                <PostHeader
                  avatar={post.userDetails?.avatar}
                  fullName={post.userDetails?.fullName}
                  isPostOwner={false}
                />

                {/* Content and Comments */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-start mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={post.userDetails?.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {post.userDetails?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center flex-wrap">
                          <p className="text-sm font-semibold mr-1">
                            {post.userDetails?.fullName}
                          </p>
                          <p className="text-sm">{post.caption}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getSmartDate(post.createdAt?.toString() || "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <CommentsSection
                    comments={post.comments}
                    onToggleCommentLike={handleToggleCommentLike}
                  />
                </div>

                {/* Footer - Actions & Add Comment */}
                <PostDetailsFooter
                  userAvatar={user.avatar || "/placeholder.svg"}
                  post={post}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleToggleLike={handleToggleLike}
                  handlePostComment={handlePostComment}
                  handlePostShare={handlePostShare}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
