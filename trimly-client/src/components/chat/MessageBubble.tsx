import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDirectMessage, ICommunityMessage } from "@/types/Chat";
import { useOutletContext } from "react-router-dom";
import { IBarber, IClient } from "@/types/User";

interface MessageBubbleProps {
  message: IDirectMessage | ICommunityMessage;
  chatType: "dm" | "community";
}

export function MessageBubble({ message, chatType }: MessageBubbleProps) {
  const user = useOutletContext<IBarber | IClient>();
  const isSent = message.senderId === user?.userId;

  const formatTime = (date: Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 15) {
      return formatDistanceToNow(messageDate, { addSuffix: true });
    } else {
      return format(messageDate, "h:mm a");
    }
  };

  const senderName =
    chatType === "community" ? (message as ICommunityMessage).senderName : "";

  const senderAvatar =
    chatType === "community" ? (message as ICommunityMessage).senderAvatar : "";

  const avatarSrc = isSent
    ? user?.avatar
    : chatType === "community"
    ? senderAvatar
    : "/placeholder.svg";

  const avatarFallback = isSent
    ? "U"
    : chatType === "community"
    ? senderName.substring(0, 2).toUpperCase()
    : "OT";

  return (
    <div
      className={`flex items-start gap-3 ${isSent ? "flex-row-reverse" : ""}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          isSent ? "items-end" : "items-start"
        } max-w-[75%]`}
      >
        {/* Show sender name for community chats if not sent by current user */}
        {chatType === "community" && !isSent && (
          <span className="text-xs text-gray-500 mb-1">{senderName}</span>
        )}

        <div
          className={`rounded-md min-w-fit px-3 py-2 w-auto text-sm ${
            isSent
              ? "bg-[var(--yellow)] text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {message.messageType === "image" ? (
            <div className="space-y-2">
              <img
                src={message.mediaUrl || "/placeholder.svg"}
                alt="Message attachment"
                className="rounded-md max-h-60 w-full object-contain"
              />
              {message.content && <p className="mt-2">{message.content}</p>}
            </div>
          ) : (
            <p className="break-words">{message.content}</p>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
