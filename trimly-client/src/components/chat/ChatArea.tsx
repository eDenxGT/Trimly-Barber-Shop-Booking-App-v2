import { useRef, useEffect } from "react";
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
import { IDirectChat, ICommunityChat } from "@/types/Chat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useChat } from "@/contexts/ChatContext";

export function ChatArea() {
  const { messages, sendMessage, currentChat, chatType } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  const chatName =
    chatType === "dm"
      ? (currentChat as IDirectChat).participant.name
      : (currentChat as ICommunityChat).name;

  const chatAvatar =
    chatType === "dm"
      ? (currentChat as IDirectChat).participant.profileImageUrl
      : (currentChat as ICommunityChat).imageUrl;

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
            <h3 className="font-medium text-[var(--darkblue)]">{chatName}</h3>
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
                  className="text-[var(--darkblue)] rounded-full h-9 w-9"
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
                  className="text-[var(--darkblue)] rounded-full h-9 w-9"
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
                  className="text-[var(--darkblue)] rounded-full h-9 w-9"
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
                senderData={{
                  name: chatName,
                  avatar: chatAvatar || "/placeholder.svg",
                }}
                key={message.messageId}
                message={message}
                chatType={chatType}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
