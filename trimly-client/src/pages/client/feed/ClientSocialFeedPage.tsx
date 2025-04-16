import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostCard } from "@/components/feed/post/PostCard";
import { PostCardSkeleton } from "@/components/common/skeletons/PostCardSkeleton";
import { PostOverviewModal } from "@/components/modals/PostOverviewModal";
import { useGetPostsForClient } from "@/hooks/feed/useGetPosts";
import { IPost } from "@/types/Feed";
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
} from "@/services/client/clientService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { handlePostShare } from "@/utils/helpers/shareLink";

export function ClientSocialFeedPage() {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isPostOverviewModalOpen, setIsPostOverviewModalOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useGetPostsForClient();
  const { mutate: toggleLike } = useToggleLikePost(clientToggleLikePost);
  const { mutate: postComment } = usePostComment(clientPostComment);
  const { mutate: toggleCommentLike } = useToggleCommentLike(
    clientToggleCommentLike
  );
  const { successToast, errorToast } = useToaster();
  const navigate = useNavigate();

  const posts = data?.pages.flatMap((page) => page.items) || [];

  const handleOnOpenChange = (open: boolean) => {
    setIsPostOverviewModalOpen(open);
    if (!open) {
      setSelectedPost(null);
    }
  };

  const handleToggleLike = (postId: string) => {
    toggleLike(
      { postId },
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

  const handleRedirectToPost = (postId: string) => {
    navigate(`/feed/post/${postId}`);
  };

  const handleOpenPostOverview = (post: IPost) => {
    setSelectedPost(post);
    setIsPostOverviewModalOpen(true);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"client-feed"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto mt-16 px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-semibold">Feed</h1>
            </div>
          </div>

          {isFetching && posts.length === 0 ? (
            <div className="grid grid-cols-1 max-w-md mx-auto gap-6">
              {[...Array(1)].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading posts
            </div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length || 0}
              next={fetchNextPage}
              hasMore={hasNextPage || false}
              loader={
                <div className="grid grid-cols-1 max-w-md mx-auto gap-6 mt-6">
                  {[...Array(1)].map((_, index) => (
                    <PostCardSkeleton key={`loading-${index}`} />
                  ))}
                </div>
              }
              endMessage={
                posts.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No more posts to load
                  </div>
                )
              }
            >
              <div className="grid grid-cols-1 max-w-md mx-auto gap-6">
                {Array.isArray(posts) &&
                  posts.map((post) => (
                    <PostCard
                      onShare={() => handlePostShare(post.postId)}
                      onToggleLike={() => handleToggleLike(post.postId)}
                      onViewDetail={() => handleOpenPostOverview(post)}
                      key={post.postId}
                      post={post}
                    />
                  ))}
              </div>
            </InfiniteScroll>
          )}

          {posts.length === 0 && !isFetching && (
            <div className="text-center py-8 text-gray-600">
              <p className="text-xl font-semibold mb-2">No posts found</p>
              {/* <p>Try adjusting your search</p> */}
            </div>
          )}

          <PostOverviewModal
            handleRedirectToPost={handleRedirectToPost}
            onPostComment={handlePostComment}
            onToggleLike={handleToggleLike}
            onToggleCommentLike={handleToggleCommentLike}
            isOpen={isPostOverviewModalOpen}
            onOpenChange={handleOnOpenChange}
            selectedPostId={selectedPost?.postId || null}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
