import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Heart, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { IPost } from "@/types/Feed";

interface PostCardProps {
  post: IPost;
  onToggleStatus: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onClick: () => void;
  onToggleLike: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleStatus,
  onEdit,
  onDelete,
  onClick,
  onToggleLike,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  return (
    <Card
      key={post.postId}
      className="overflow-hidden py-0 transition-all hover:shadow-md hover:scale-101"
    >
      <div className="aspect-video overflow-hidden relative">
        <img
          onClick={onClick}
          src={post.image}
          alt={post.caption}
          className="w-full h-full cursor-pointer object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={post.status === "active" ? "bg-green-500" : "bg-red-500"}
          >
            {post.status}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 min-h-30">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">
            {post.caption}
          </CardTitle>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {post.status === "active" ? "Active" : "Blocked"}
            </span>
            <Switch
              checked={post.status === "active"}
              onCheckedChange={() => onToggleStatus(post.postId || "")}
              className={
                "cursor-pointer" + post.status === "active"
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {post.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>
              Posted: {getSmartDate(post.createdAt?.toString() || "")}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center text-gray-500">
          <Heart
            className="h-4 w-4 mr-1 cursor-pointer"
            fill={post?.isLiked ? "#f43f5e" : "none"}
            stroke={post?.isLiked ? "#f43f5e" : "currentColor"}
            onClick={() => onToggleLike(post.postId || "")}
          />
          <span className="text-sm">{post?.likesCount || 0}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 btn-outline"
            onClick={() => onEdit(post.postId || "")}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={() => onDelete(post.postId || "")}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />
    </Card>
  );
};
