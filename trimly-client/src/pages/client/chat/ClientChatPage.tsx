import { ChatLayout } from "@/components/chat/ChatLayout";
import {
  useFetchAllChatByUserId,
  useFetchChatById,
} from "@/hooks/chat/useChats";
import {
  getAllChatsByClientId,
  getChatByChatId,
  getChatByUserId as getClientChatByUserId,
} from "@/services/client/clientService";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";


export const ClientChatPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdFromUrl = params.get("userId");
  const chatIdFromUrl = params.get("chatId");

  const id = chatIdFromUrl || userIdFromUrl;
  const queryFunc = chatIdFromUrl ? getChatByChatId : getClientChatByUserId;


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
          <ChatLayout
            activeChat={chatRes?.chat || null}
            chatType="dm"
            allChats={allChatsData?.chats || []}
            userRole="client"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
