import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, CalendarClock, ExternalLink, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetMeetingById } from "@/hooks/meeting/useMeetingRoom";
import { CircularProgress } from "@mui/material";


interface MeetingDetailsModalProps {
  communityId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingDetailsModal({
  communityId,
  isOpen,
  onClose,
}: MeetingDetailsModalProps) {

  const { data, isFetching, isError } = useGetMeetingById(communityId || "");
  
  const meeting = data?.meeting;

  if (!isOpen) return null;

  if (isFetching && !isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center py-10">
          <CircularProgress />
          <p className="text-sm text-gray-500 mt-4">
            Loading meeting details...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!meeting) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              No Meeting Found
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 text-sm">
            No scheduled meetings found for this community.
          </p>
          <DialogFooter className="justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const startTime =
    typeof meeting?.startTime === "string"
      ? new Date(meeting?.startTime)
      : meeting?.startTime;

  const endTime =
    typeof meeting?.endTime === "string"
      ? new Date(meeting?.endTime)
      : meeting?.endTime;

  const formatDate = (date: Date) => {
    if (!date) return "";
    return format(date, "PPP");
  };

  const formatTime = (date: Date) => {
    if (!date) return "";
    return format(date, "h:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleJoinMeeting = () => {
    if (meeting.meetLink) {
      window.open(meeting.meetLink, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {meeting?.title || "Meeting"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <Badge className={`${getStatusColor(meeting.status || "")}`}>
              {meeting.status &&
                meeting?.status?.charAt(0).toUpperCase() +
                  meeting?.status.slice(1)}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-500">{formatDate(startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-gray-500">
                  {formatTime(startTime)} - {formatTime(endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {meeting.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-gray-500 whitespace-pre-wrap">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Meeting Link */}
          {meeting.meetLink && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Meeting Link</h3>
              <div className="flex items-center gap-2 text-sm text-yellow-600 overflow-hidden">
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{meeting.meetLink}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {meeting.meetLink && meeting.status === "scheduled" && (
            <Button
              onClick={handleJoinMeeting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
