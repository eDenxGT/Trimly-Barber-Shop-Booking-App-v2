import { ChatLayout } from "@/components/chat/ChatLayout";
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
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allChatsData, chatRes] = await Promise.all([
          getAllChatsByClientId(),
          id ? queryFunc(id) : Promise.resolve({ chat: null }),
        ]);

        if (allChatsData?.chats) {
          setAllChats(allChatsData.chats);
        }

        if (chatRes?.chat) {
          setCurrentChat(chatRes.chat);
        }

      } catch (error: any) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();
  }, [id, queryFunc]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="client-chat-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <ChatLayout userRole="client" />
      </motion.div>
    </AnimatePresence>
  );
};
