import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ICommunityChat } from "@/types/Chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import MuiButton from "../common/buttons/MuiButton";
import { useNavigate } from "react-router-dom";

interface CommunityDetailsModalProps {
  community: ICommunityChat | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityDetailsModal = ({
  community,
  isOpen,
  onClose,
}: CommunityDetailsModalProps) => {
  //   const { toast } = useToast();

  const navigate = useNavigate();

  if (!community) return null;

  const handleRemoveBarber = (barberId: string, barberName: string) => {
    // TODO: Implement actual removal logic when backend is connected
    console.log("Removing barber:", barberId, barberName);
    // toast({
    //   title: "Barber Removed",
    //   description: `${barberName} has been removed from the community.`,
    // });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            {community.imageUrl && (
              <img
                src={community.imageUrl}
                alt={community.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            {community.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          <div className="grid grid-cols-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 mb-1">
                Description
              </h3>
              <p className="text-sm text-zinc-900">
                {community.description || "No description"}
              </p>
            </div>

            {/* Status */}
            {community.status && (
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">
                  Status
                </h3>
                <p className="text-sm text-zinc-900 capitalize">
                  {community.status === "active" ? (
                    <span className="bg-green-500 text-white font-medium px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white font-medium px-2 py-1 rounded">
                      Blocked
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Created By */}
            <div>
              <h3 className="text-sm font-medium text-zinc-500 mb-1">
                Created By
              </h3>
              <div className="flex items-center gap-2">
                {community.createdBy.avatar && (
                  <Avatar>
                    <img
                      src={community.createdBy.avatar}
                      alt={community.createdBy.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Avatar>
                )}
                <span className="text-sm text-zinc-900">
                  {community.createdBy.name}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div>
              <h3 className="text-sm font-medium text-zinc-500 mb-1">
                Created
              </h3>
              <p className="text-sm text-zinc-900">
                {getSmartDate(community.createdAt.toString())}
              </p>
            </div>
          </div>

          {/* Members List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-500">
                Members ({community.membersCount})
              </h3>
              <MuiButton
                variant="darkblue"
                className="text-sm font-medium text-zinc-500 mb-2"
                onClick={() =>
                  navigate(
                    `/admin/communities/${community.communityId}/schedule-meeting`
                  )
                }
              >
                Schedule Meeting
              </MuiButton>
            </div>

            <ScrollArea className="h-[240px] rounded-md border border-zinc-200">
              {!community.members?.length ? (
                <div className="flex items-center justify-center h-full text-sm text-zinc-500">
                  No members in this community yet
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {community.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.shopName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {member.shopName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {member.role || "Member"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleRemoveBarber(
                            member.userId || "",
                            member.shopName || ""
                          )
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
