import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostCardSkeleton } from "@/components/common/skeletons/BarberPostCardSkeleton";
import { useGetPostsForBarber } from "@/hooks/feed/useGetPosts";
import MuiAnimatedButton from "@/components/common/buttons/AnimatedButton";
import { PostCard } from "@/components/common/cards/BarberPostCard";
import { PostOverviewModal } from "@/components/modals/PostOverviewModal";
import { useState } from "react";
import { IPost } from "@/types/Feed";

interface IMyPostsListProps {
  onDelete: (postId: string) => void;
  onStatusUpdate: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onPostComment: (postId: string, comment: string) => void;
  onToggleCommentLike: (commentId: string, postId: string) => void;
}

export const MyPostsList = ({
  onDelete,
  onStatusUpdate,
  onToggleLike,
  onPostComment,
  onToggleCommentLike,
}: IMyPostsListProps) => {
  const navigate = useNavigate();
  const [isPostOverviewModalOpen, setIsPostOverviewModalOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useGetPostsForBarber();
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const handleOnOpenChange = (open: boolean) => {
    setIsPostOverviewModalOpen(open);
  };
  const toggleStatus = (postId: string) => {
    onStatusUpdate(postId);
  };
  const handleEdit = (postId: string) => {
    navigate(`/barber/my-posts/${postId}/edit`);
  };

  const handleDelete = (postId: string) => {
    onDelete(postId);
  };
  const handlePostComment = (postId: string, comment: string) => {
    onPostComment(postId, comment);
  };
  const handleToggleCommentLike = (commentId: string, postId: string) => {
    onToggleCommentLike(commentId, postId);
  };
  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">All Posts</h1>

        <MuiAnimatedButton
          className="max-h-9"
          onClick={() => navigate("/barber/my-posts/create")}
        >
          Create Post <Plus className="w-4 h-4 ml-2" />
        </MuiAnimatedButton>
      </div>

      {isFetching && posts?.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">Error loading posts</div>
      ) : (
        <InfiniteScroll
          dataLength={posts?.length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          loader={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(6)].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          }
          endMessage={
            posts?.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                No more posts to load
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(posts) &&
              posts?.map((post) => (
                <PostCard
                  onToggleLike={() => onToggleLike(post.postId)}
                  onClick={() => {
                    setSelectedPost(post);
                    setIsPostOverviewModalOpen(true);
                  }}
                  key={post.postId}
                  post={post}
                  onToggleStatus={toggleStatus}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </InfiniteScroll>
      )}

      {posts?.length === 0 && !isFetching && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-xl font-semibold mb-2">No posts found</p>
          {/* <p>Try adjusting your search</p> */}
        </div>
      )}
      <PostOverviewModal
        onPostComment={handlePostComment}
        onToggleLike={onToggleLike}
        onToggleCommentLike={handleToggleCommentLike}
        isOpen={isPostOverviewModalOpen}
        onOpenChange={handleOnOpenChange}
        selectedPostId={selectedPost?.postId || null}
        toggleStatus={toggleStatus}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};
