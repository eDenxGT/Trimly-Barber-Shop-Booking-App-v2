import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/common/useMobile";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";
import { useSocket } from "@/contexts/SocketContext";

interface ChatLayoutProps {
  userRole: "barber" | "client";
  handleTypeChangeForPage?: (type: "dm" | "community") => void;
}

export function ChatLayout({
  userRole,
  handleTypeChangeForPage,
}: ChatLayoutProps) {
  const [showChatArea, setShowChatArea] = useState(false);
  const isMobile = useIsMobile();
  const { currentChat, onTypeChange, handleChangeChat, chatType } = useChat();
  const socket = useSocket();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) {
      setShowChatArea(!!currentChat);
    }
  }, [isMobile, currentChat]);

  const handleChatSelect = (chatId: string) => {
    navigate(
      `${
        userRole === "barber" ? "/barber" : ""
      }/chat?chatId=${chatId}&type=${chatType}`
    );

    handleChangeChat();
    if (chatType === "dm") {
      socket.emit("direct-chat:read-message", { chatRoomId: chatId });
    }

    if (isMobile) {
      setShowChatArea(true);
    }
  };

  const handleChangeType = (value: "dm" | "community") => {
    onTypeChange?.(value);
    handleTypeChangeForPage?.(value);
  };

  const handleBackToList = () => {
    setShowChatArea(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] mt-16 bg-white">
      {userRole === "barber" && (
        <Tabs
          defaultValue={chatType}
          className="w-full"
          onValueChange={(value) =>
            handleChangeType(value as "dm" | "community")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="dm"
              className="data-[state=active]:bg-[var(--darkblue)] data-[state=active]:hover:bg-[var(--darkblue-hover)] data-[state=active]:text-white"
            >
              Direct Messages
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-[var(--darkblue)] data-[state=active]:hover:bg-[var(--darkblue-hover)] data-[state=active]:text-white"
            >
              Community
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || !showChatArea) && (
          <div className={`${isMobile ? "w-full" : "w-1/4 border-r"}`}>
            <ChatSidebar onSelectChat={handleChatSelect} />
          </div>
        )}

        {(!isMobile || showChatArea) && (
          <div className={`${isMobile ? "w-full" : "w-3/4"} flex flex-col`}>
            {isMobile && showChatArea && (
              <div className="p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="text-[var(--darkblue)]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            )}
            {currentChat ? (
              <ChatArea />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
