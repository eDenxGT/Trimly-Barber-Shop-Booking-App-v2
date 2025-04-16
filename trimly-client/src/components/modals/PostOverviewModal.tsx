import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { useOutletContext } from "react-router-dom";
import type { IBarber, IClient } from "@/types/User";
import { CommentsSection } from "../feed/comment/CommentSection";
import { PostHeader } from "../feed/post/PostHeader";
import { useEffect, useState } from "react";
import { IPost } from "@/types/Feed";
import { useGetPostByPostId } from "@/hooks/feed/useGetPosts";
import { fetchPostByPostIdForBarbers } from "@/services/barber/barberService";
import { fetchPostByPostIdForClients } from "@/services/client/clientService";
import { PostDetailsFooter } from "../feed/post/details/PostDetailsFooter";
import { handlePostShare } from "@/utils/helpers/shareLink";

type PostDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPostId: string | null;
  toggleStatus?: (postId: string) => void;
  handleEdit?: (postId: string) => void;
  handleDelete?: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onPostComment: (postId: string, comment: string) => void;
  onToggleCommentLike: (commentId: string, postId: string) => void;
  handleRedirectToPost?: (postId: string) => void;
};

export function PostOverviewModal({
  isOpen,
  onOpenChange,
  selectedPostId,
  handleEdit,
  handleDelete,
  onToggleLike,
  onPostComment,
  onToggleCommentLike,
  handleRedirectToPost,
}: PostDetailModalProps) {
  const { role } = useOutletContext<IBarber | IClient>();
  const queryFn =
    role === "barber"
      ? fetchPostByPostIdForBarbers
      : fetchPostByPostIdForClients;

  const { data } = useGetPostByPostId(queryFn, selectedPostId || "", "details");
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    if (data?.post) {
      setSelectedPost(data.post);
    }
  }, [data]);

  const handlePostComment = () => {
    if (selectedPost && newComment.trim() !== "") {
      onPostComment(selectedPost.postId || "", newComment.trim());
      setNewComment("");
      // commentRef.current?.focus();
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    onToggleCommentLike(commentId, selectedPost?.postId || "");
  };

  const user: IClient | IBarber = useOutletContext();
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="p-0 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
      >
        {selectedPost && (
          <>
            {/* Left - Image */}
            <div className="md:w-3/5 bg-black flex items-center justify-center">
              <img
                src={selectedPost.image || "/placeholder.svg"}
                alt={selectedPost.caption}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Right - Info & Comments */}
            <div className="md:w-2/5 flex flex-col h-full max-h-[90vh] bg-white">
              {/* Header */}
              <PostHeader
                avatar={selectedPost.userDetails?.avatar}
                fullName={selectedPost.userDetails?.fullName}
                status={selectedPost.status}
                postId={selectedPost.postId}
                isPostOwner={selectedPost.barberId === user.userId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Content and Comments - Using flex-1 to take available space */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="px-4 py-2 border-b">
                  <div
                    onClick={() =>
                      handleRedirectToPost &&
                      handleRedirectToPost(selectedPost.postId || "")
                    }
                    className="flex cursor-pointer items-start mb-2"
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={
                          selectedPost.userDetails?.avatar || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {selectedPost.userDetails?.fullName
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm cursor-pointer font-semibold mr-1">
                          {selectedPost.userDetails?.fullName}
                        </p>
                        <p className="text-sm">{selectedPost.caption}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedPost.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getSmartDate(String(selectedPost.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments - This will grow to fill available space */}
                <CommentsSection
                  comments={selectedPost.comments}
                  onToggleCommentLike={handleToggleCommentLike}
                />
              </div>

              {/* Footer - Actions & Add Comment - Always at the bottom */}
              <PostDetailsFooter
                userAvatar={user?.avatar || "/placeholder.svg"}
                post={selectedPost}
                newComment={newComment}
                setNewComment={setNewComment}
                handleToggleLike={onToggleLike}
                handlePostComment={handlePostComment}
                handlePostShare={() =>
                  handlePostShare(selectedPost?.postId || "")
                }
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
