import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IDirectChat, IDirectMessage, ICommunityMessage } from "@/types/Chat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { v4 as uuidv4 } from "uuid";

type ChatProps = {
  chat: IDirectChat | ICommunityChat;
  chatType: "dm" | "community";
};

// Define ICommunityChat interface based on your data model
interface ICommunityChat {
  communityId: string;
  community: {
    name: string;
    imageUrl?: string;
  };
  messages: ICommunityMessage[];
}

export function ChatArea({ chat, chatType }: ChatProps) {
  const [messages, setMessages] = useState<
    IDirectMessage[] | ICommunityMessage[]
  >(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat]);

  const handleSendMessage = (content: string, imageUrl?: string) => {
    const messageType: "text" | "image" = imageUrl ? "image" : "text";
    const currentUserId = "currentUserId";

    if (chatType === "dm") {
      const directChat = chat as IDirectChat;
      const newMessage: IDirectMessage = {
        messageId: uuidv4(),
        chatRoomId: directChat.chatRoomId,
        senderId: currentUserId,
        receiverId: directChat.participant.userId || "",
        messageType,
        content,
        mediaUrl: imageUrl,
        timestamp: new Date(),
        status: "sent",
      };

      setMessages([...messages, newMessage] as
        | IDirectMessage[]
        | ICommunityMessage[]);
    } else {
      const communityChat = chat as ICommunityChat;
      const newMessage: ICommunityMessage = {
        messageId: uuidv4(),
        groupId: communityChat.communityId,
        senderId: currentUserId,
        messageType,
        content,
        mediaUrl: imageUrl,
        timestamp: new Date(),
        status: "sent",
        readBy: [currentUserId],
        senderName: "Current User",
        senderAvatar: "/placeholder.svg",
      };

      setMessages([...messages, newMessage as any]);
    }
  };

  const chatName =
    chatType === "dm"
      ? (chat as IDirectChat).participant.name
      : (chat as ICommunityChat).community.name;

  const chatAvatar =
    chatType === "dm"
      ? (chat as IDirectChat).participant.profileImageUrl
      : (chat as ICommunityChat).community.imageUrl;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage
              src={chatAvatar || "/placeholder.svg"}
              alt={chatName}
            />
            <AvatarFallback>{chatName?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-[--darkblue]">{chatName}</h3>
            <p className="text-xs text-muted-foreground">
              {chatType === "dm"
                ? "Active now"
                : `${Math.floor(Math.random() * 10) + 2} members active`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[--darkblue] rounded-full h-9 w-9"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[--darkblue] rounded-full h-9 w-9"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[--darkblue] rounded-full h-9 w-9"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50 relative">
        <ScrollArea className="h-full px-4">
          <div className="space-y-6 ">
            <span className="text-muted-foreground text-xs text-center m-2 block">
              Beginning of chat
            </span>
            {messages.map((message) => (
              <MessageBubble
                key={message.messageId}
                message={message}
                chatType={chatType}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
