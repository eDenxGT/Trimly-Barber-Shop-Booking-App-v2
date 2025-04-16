import { useState, useRef } from "react";
import { Heart, MessageCircle, Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FeedFooterProps {
  post: any;
  userAvatar: string;
  newComment: string;
  setNewComment: (value: string) => void;
  handleToggleLike: (postId: string) => void;
  handlePostComment: (postId: string, comment: string) => void;
  handlePostShare: (postId: string) => void;
}

export const PostDetailsFooter = ({
  userAvatar,
  post,
  newComment,
  setNewComment,
  handleToggleLike,
  handlePostComment,
  handlePostShare,
}: FeedFooterProps) => {
  const commentRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewComment(newComment + emojiData.emoji);
  };

  return (
    <div className="border-t mt-auto">
      <div className="flex justify-between p-3">
        <div className="flex gap-4">
          <Button
            onClick={() => handleToggleLike(post.postId || "")}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Heart
              className="h-6 w-6"
              fill={post.isLiked ? "#f43f5e" : "none"}
              stroke={post.isLiked ? "#f43f5e" : "currentColor"}
            />
          </Button>
          <Button
            onClick={() => commentRef.current?.focus()}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
        <Button
          onClick={() => handlePostShare(post.postId || "")}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <p className="text-sm font-semibold">
          {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
        </p>
      </div>

      <div className="flex items-center p-3 border-t relative">
        <Avatar className="h-7 w-7 mr-2">
          <AvatarImage src={userAvatar || "/placeholder.svg"} />
          <AvatarFallback>{"U"}</AvatarFallback>
        </Avatar>

        <input
          ref={commentRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-sm outline-none"
        />

        <Button
          onClick={() => handlePostComment(post.postId || "", newComment)}
          disabled={newComment.trim() === ""}
          variant="ghost"
          className="text-primary font-semibold h-8"
        >
          Post
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="ml-1"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="h-5 w-5" />
        </Button>

        {showEmojiPicker && (
          <div className="absolute bottom-14 right-3 z-10">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};
