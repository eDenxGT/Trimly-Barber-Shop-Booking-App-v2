import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send } from "lucide-react";
import type { IPost } from "@/types/Feed";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { useOutletContext } from "react-router-dom";
import type { IBarber, IClient } from "@/types/User";
import { CommentsSection } from "../feed/comment/CommentSection";
import { PostHeader } from "../feed/post/PostHeader";

type PostDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: IPost | null;
  toggleStatus: (postId: string) => void;
  handleEdit: (postId: string) => void;
  handleDelete: (postId: string) => void;
};

export function PostOverviewModal({
  isOpen,
  onOpenChange,
  selectedPost,
  toggleStatus,
  handleEdit,
  handleDelete,
}: PostDetailModalProps) {
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
                onToggleStatus={toggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Content and Comments - Using flex-1 to take available space */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="px-4 py-2 border-b">
                  <div className="flex items-start mb-2">
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
                        <p className="text-sm font-semibold mr-1">
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
                <CommentsSection comments={selectedPost.comments} />
              </div>

              {/* Footer - Actions & Add Comment - Always at the bottom */}
              <div className="border-t mt-auto">
                <div className="flex justify-between p-3">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Heart
                        className="h-6 w-6"
                        fill={
                          selectedPost?.likes?.length ?? 0 > 0
                            ? "#f43f5e"
                            : "none"
                        }
                        stroke={
                          selectedPost?.likes?.length ?? 0 > 0
                            ? "#f43f5e"
                            : "currentColor"
                        }
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <Send className="h-6 w-6" />
                  </Button>
                </div>

                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">
                    {selectedPost.likes?.length || 0}{" "}
                    {selectedPost.likes?.length === 1 ? "like" : "likes"}
                  </p>
                </div>

                <div className="flex items-center p-3 border-t">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.role === "client"
                        ? (user as IClient)?.fullName?.charAt(0)
                        : (user as IBarber)?.shopName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 font-semibold"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
