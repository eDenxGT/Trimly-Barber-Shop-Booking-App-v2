import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ICommunityChat, IDirectChat, IDirectChatPreview } from "@/types/Chat";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/contexts/ChatContext";

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const { allChats, currentChat } = useChat();
  return (
    <div className="h-full flex flex-col bg-white shadow-sm">
      <div className="py-4 px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[var(--darkblue)]">Chats</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="py-2 space-y-1">
          {allChats.map((chat) => {
            const isCommunity = "communityId" in chat;
            const id = isCommunity ? chat.communityId : chat.chatRoomId;
            const isActive = isCommunity
              ? (currentChat as ICommunityChat)?.communityId === id
              : (currentChat as IDirectChat)?.chatRoomId === id;

            return (
              <div
                key={id}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                  isActive ? "bg-yellow-100 border-l-4 border-yellow-400" : ""
                }`}
                onClick={() => onSelectChat(id)}
              >
                <Avatar className="h-12 w-12 mr-3 flex-shrink-0">
                  <AvatarImage
                    src={
                      isCommunity
                        ? chat.imageUrl
                        : chat.user.profileImageUrl || "/placeholder.svg"
                    }
                    alt={isCommunity ? chat.name : chat.user.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                    {isCommunity
                      ? chat.name.substring(0, 2)
                      : chat.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {isCommunity ? chat.name : chat.user.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {chat.lastMessage?.timestamp
                        ? getSmartDate(chat.lastMessage?.timestamp.toString())
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.content ? (
                      chat.lastMessage.content
                    ) : (
                      <span className="text-gray-400 italic">
                        No messages yet
                      </span>
                    )}
                  </p>
                </div>

                {(chat as IDirectChatPreview)?.unreadCount > 0 && (
                  <Badge className="ml-2 bg-yellow-400 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {(chat as IDirectChatPreview)?.unreadCount}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
