import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IComment } from "@/types/Feed";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { Heart } from "lucide-react";

interface CommentsSectionProps {
  comments?: IComment[] | null;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
}) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[220px] text-gray-400">
        <p>No comments yet</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {comments.map((comment) => (
        <div key={comment.commentId} className="flex items-start mb-4">
          <Avatar className="h-7 w-7 mr-2">
            <AvatarImage
              src={comment.userDetails?.avatar || "/placeholder.svg"}
            />
            <AvatarFallback>
              {comment.userDetails?.fullName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline">
              <p className="text-sm font-semibold mr-2">
                {comment.userDetails?.fullName}
              </p>
              <p className="text-sm">{comment.commentText}</p>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <span>{getSmartDate(String(comment.createdAt))}</span>
              {comment.likes && comment.likes.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span>
                    {comment.likes.length}{" "}
                    {comment.likes.length === 1 ? "like" : "likes"}
                  </span>
                </>
              )}
              <span className="mx-1">•</span>
              <button className="font-medium">Reply</button>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Heart className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
