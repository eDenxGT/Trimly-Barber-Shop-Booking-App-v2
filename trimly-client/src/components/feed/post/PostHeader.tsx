import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useState } from "react";

interface PostHeaderProps {
  avatar?: string;
  fullName?: string;
  status?: "active" | "blocked";
  postId?: string;
  isPostOwner: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  avatar,
  fullName,
  status = "active",
  postId = "",
  isPostOwner,
  onEdit,
  onDelete,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {/* Avatar + Name */}
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={avatar || "/placeholder.svg"} />
          <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{fullName}</p>
          {isPostOwner && (
            <p className="text-xs text-gray-500">
              Post status: {status === "active" ? "Active" : "Blocked"}
            </p>
          )}
        </div>
      </div>

      {/* Switch + Popover Actions */}
      {isPostOwner && (
        <div className="flex items-center mr-5 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => onEdit?.(postId)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Post</span>
                    </CommandItem>
                    <CommandItem
                      onSelect={() => setIsDeleteModalOpen(true)}
                      className="cursor-pointer text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Post</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <ConfirmationModal
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
        title="Delete Post"
        description="This action cannot be undone. This will permanently delete the post and remove it from our servers."
        onConfirm={() => onDelete?.(postId)}
      />
    </div>
  );
};
