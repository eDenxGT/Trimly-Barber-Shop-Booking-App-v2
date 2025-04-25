import { ChatLayout } from "@/components/chat/ChatLayout";
import { useFetchChatByUserId } from "@/hooks/chat/useChats";
import { getChatByUserId as getClientChatByUserId } from "@/services/client/clientService";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export const ClientChatPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdFromUrl = params.get("userId");

  const {
    data: chatRes,
    isLoading,
    isError,
  } = useFetchChatByUserId(getClientChatByUserId, userIdFromUrl || "");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"client-chat-page"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading && !isError ? (
          <div className="text-center text-gray-500 py-10">Loading chat...</div>
        ) : (
          <ChatLayout userRole="client" chat={chatRes?.chat ?? null} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
