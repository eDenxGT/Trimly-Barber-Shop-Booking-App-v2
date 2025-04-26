import { ChatLayout } from "@/components/chat/ChatLayout";
import {
  useFetchAllChatByUserId,
  useFetchChatById,
} from "@/hooks/chat/useChats";
import {
  getAllChatsByBarberId,
  getChatByChatIdForBarber,
  getChatByUserIdForBarber,
} from "@/services/barber/barberService";
import { ICommunityChat, ICommunityChatPreview, IDirectChat, IDirectChatPreview } from "@/types/Chat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const BarberChatPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdFromUrl = params.get("userId");
  const chatIdFromUrl = params.get("chatId");
  const [chatType, setChatType] = useState<"dm" | "community">("dm");

  const id = chatIdFromUrl || userIdFromUrl;
  const queryFunc = chatIdFromUrl
    ? getChatByChatIdForBarber
    : getChatByUserIdForBarber;

  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: allChatsError,
    refetch: refetchAllChats,
  } = useFetchAllChatByUserId(getAllChatsByBarberId);

  const {
    data: chatRes,
    isLoading: chatByIdLoading,
    isError: chatByIdError,
  } = useFetchChatById(queryFunc, id || "");

  useEffect(() => {
    if (!chatRes?.chat) return;
  
    const chatRoomId =
      chatType === "dm"
        ? (chatRes.chat as IDirectChat).chatRoomId
        : (chatRes.chat as ICommunityChat).communityId;
  
    const existsInSidebar = allChatsData?.chats?.some((c) => {
      const cId =
        chatType === "dm"
          ? (c as IDirectChatPreview).chatRoomId
          : (c as ICommunityChatPreview).communityId;
      return cId === chatRoomId;
    });
  
    if (!existsInSidebar) {
      refetchAllChats();
    }
  }, [chatRes, allChatsData, chatType]);
  

  const handleChangeType = (value: "dm" | "community") => {
    setChatType(value);
  };

  const isOverallLoading = allChatsLoading || chatByIdLoading;
  const isOverallError = allChatsError || chatByIdError;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="barber-chat-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {isOverallLoading && !isOverallError ? (
          <div className="text-center text-gray-500 py-10">Loading chat...</div>
        ) : (
          <ChatLayout
            onTypeChange={handleChangeType}
            activeChat={chatRes?.chat || null}
            chatType={chatType}
            allChats={allChatsData?.chats || []}
            userRole="barber"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
