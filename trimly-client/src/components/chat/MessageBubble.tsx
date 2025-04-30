import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDirectMessage, ICommunityMessage } from "@/types/Chat";
import { useOutletContext } from "react-router-dom";
import { IBarber, IClient } from "@/types/User";
import { getPresignedUrl } from "@/services/s3/getPresignedUrl";
import { useState, useEffect } from "react";
import { getSmartDate } from "@/utils/helpers/timeFormatter";

interface MessageBubbleProps {
  message: IDirectMessage | ICommunityMessage;
  chatType: "dm" | "community";
  senderData: { name: string; avatar: string };
}

export function MessageBubble({
  message,
  chatType,
  senderData,
}: MessageBubbleProps) {
  const user = useOutletContext<IBarber | IClient>();
  const isSent = message.senderId === user?.userId;
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaUrl = async () => {
      if (message?.mediaUrl) {
        const url = await getMediaUrl(message.mediaUrl);
        setMediaUrl(url);
      }
    };

    fetchMediaUrl();
  }, [message?.mediaUrl]);

  const senderName =
    chatType === "community"
      ? (message as ICommunityMessage).senderName
      : senderData?.name;

  const senderAvatar =
    chatType === "community"
      ? (message as ICommunityMessage).senderAvatar
      : senderData?.avatar;

  const avatarSrc = isSent ? user?.avatar : senderAvatar || "/placeholder.svg";
  const avatarFallback = isSent
    ? "U"
    : senderName?.substring(0, 2).toUpperCase();

  const getMediaUrl = async (mediaKey: string) => {
    if (!mediaKey) return null;

    const presignedUrl = await getPresignedUrl(
      mediaKey,
      user?.role as "barber" | "client",
      "getObject"
    );
    return presignedUrl;
  };

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
                src={mediaUrl || "/placeholder.svg"}
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
          {getSmartDate(message.timestamp?.toString())}
        </span>
      </div>
    </div>
  );
}
