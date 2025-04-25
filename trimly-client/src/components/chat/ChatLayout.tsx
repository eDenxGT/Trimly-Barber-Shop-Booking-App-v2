import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/common/useMobile";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { IDirectChat } from "@/types/Chat";

interface ChatLayoutProps {
  userRole: "barber" | "client";
  chat?: IDirectChat | null;
}

export function ChatLayout({ userRole, chat }: ChatLayoutProps) {
  const [activeChat, setActiveChat] = useState<IDirectChat | null>(
    chat || null
  );
  const [chatType, setChatType] = useState<"dm" | "community">("dm");
  const [showChatArea, setShowChatArea] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setShowChatArea(!!activeChat);
    }
  }, [isMobile, activeChat]);

  const handleChatSelect = (chat: any) => {
    setActiveChat(chat);
    if (isMobile) {
      setShowChatArea(true);
    }
  };

  const handleChangeType = (value: "dm" | "community") => {
    setActiveChat(null);
    setChatType(value);
  };

  const handleBackToList = () => {
    setShowChatArea(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] mt-16 bg-white">
      {userRole === "barber" && (
        <Tabs
          defaultValue="dm"
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
            <ChatSidebar
              chats={[]}
              onSelectChat={handleChatSelect}
              activeChat={activeChat}
            />
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
            {activeChat ? (
              <ChatArea chat={activeChat} chatType={chatType} />
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
