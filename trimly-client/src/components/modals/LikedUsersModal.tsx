import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchLikedUsersByPostId } from "@/services/client/clientService";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export interface LikedUser {
  userId: string;
  fullName: string;
  avatar?: string;
}

interface LikedUsersModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LikedUsersModal({
  isOpen,
  postId,
  onClose,
}: LikedUsersModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [likedUsers, setLikedUsers] = useState<LikedUser[]>([]);

  const { userId } = useOutletContext<{ userId: string }>();

  const fetchLikedUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLikedUsersByPostId(postId);
      setLikedUsers(data.users);
    } catch (error) {
      console.error("Error fetching liked users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedUsers();
  }, [postId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-lg font-medium">
              Likes
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="max-h-[250px] overflow-y-auto p-1 no-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : likedUsers?.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No likes yet</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {likedUsers?.map((user) => (
                <li
                  key={user.userId}
                  className="flex items-center justify-between py-2 px-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user.userId === userId ? "You" : user.fullName}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
