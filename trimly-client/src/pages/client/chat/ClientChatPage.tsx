import { ChatLayout } from "@/components/chat/ChatLayout";
import {
  useFetchAllChatByUserId,
  useFetchChatById,
} from "@/hooks/chat/useChats";
import {
  getAllChatsByClientId,
  getChatByChatIdForClient,
  getChatByUserIdForClient,
} from "@/services/client/clientService";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";

export const ClientChatPage = () => {
  const { setAllChats, setCurrentChat } = useChat();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdFromUrl = params.get("userId");
  const chatIdFromUrl = params.get("chatId");

  const id = chatIdFromUrl || userIdFromUrl;
  const queryFunc = chatIdFromUrl
    ? getChatByChatIdForClient
    : getChatByUserIdForClient;

  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: allChatsError,
  } = useFetchAllChatByUserId(getAllChatsByClientId);

  const {
    data: chatRes,
    isLoading: chatByIdLoading,
    isError: chatByIdError,
  } = useFetchChatById(queryFunc, id || "");

  useEffect(() => {
    if (allChatsData?.chats) {
      setAllChats(allChatsData.chats);
    }
  }, [allChatsData, setAllChats]);

  useEffect(() => {
    if (chatRes?.chat) {
      setCurrentChat(chatRes.chat);
    }
  }, [chatRes, setCurrentChat]);

  const isOverallLoading = allChatsLoading || chatByIdLoading;
  const isOverallError = allChatsError || chatByIdError;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="client-chat-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {isOverallLoading && !isOverallError ? (
          <div className="text-center text-gray-500 py-10">Loading chat...</div>
        ) : (
          <ChatLayout userRole="client" />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
