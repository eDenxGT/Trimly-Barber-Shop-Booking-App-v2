import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ICommunityChatPreview,
  IDirectChat,
  IDirectChatPreview,
} from "@/types/Chat";

interface ChatSidebarProps {
  chats: IDirectChatPreview[] | ICommunityChatPreview[];
  onSelectChat: (chatId: string) => void;
  activeChat: IDirectChat | null;
}

export function ChatSidebar({
  chats,
  onSelectChat,
  activeChat,
}: ChatSidebarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-[var(--darkblue)]">Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map((chat) => {
            const isCommunity = "communityId" in chat;
            const id = isCommunity ? chat.communityId : chat.chatRoomId;

            return (
              <div
                key={id}
                className={`... ${
                  activeChat?.chatRoomId === id ? "bg-yellow-100" : ""
                }`}
                onClick={() => onSelectChat(id)}
              >
                <Avatar className="...">
                  <AvatarImage
                    src={
                      isCommunity
                        ? chat.community.avatar
                        : chat.user.profileImageUrl || "/placeholder.svg"
                    }
                    alt={isCommunity ? chat.community.name : chat.user.name}
                  />
                  <AvatarFallback>
                    {isCommunity
                      ? chat.community.name.substring(0, 2)
                      : chat.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="...">
                  <div className="flex justify-between items-center">
                    <h3 className="...">
                      {isCommunity ? chat.community.name : chat.user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="...">
                    {chat.lastMessage.content?.slice(0, 36)}...
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="...">{chat.unreadCount}</span>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
