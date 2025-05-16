import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/contexts/ChatContext";
import {
  getAllChatsByBarberId,
  getAllCommunityChatsByBarberId,
  getChatByChatIdForBarber,
  getChatByUserIdForBarber,
  getCommunityChatByChatIdForBarber,
} from "@/services/barber/barberService";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const BarberChatPage = () => {
  const { setAllChats, setCurrentChat, chatType } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { userIdFromUrl, chatIdFromUrl } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      userIdFromUrl: params.get("userId"),
      chatIdFromUrl: params.get("chatId"),
    };
  }, [location.search]);

  const id = chatIdFromUrl || userIdFromUrl;

  const getChatFn = () => {
    if (chatIdFromUrl) {
      return chatType === "community"
        ? getCommunityChatByChatIdForBarber
        : getChatByChatIdForBarber;
    } else {
      return getChatByUserIdForBarber;
    }
  };

  const getAllChatsFn = () => {
    return chatType === "community"
      ? getAllCommunityChatsByBarberId
      : getAllChatsByBarberId;
  };

  const fetchAllChats = async () => {
    const res = await getAllChatsFn()();
    if (res?.chats) setAllChats(res.chats);
  };

  const fetchCurrentChat = async () => {
    if (!id) return;
    const res = await getChatFn()(id);
    if (res?.chat) setCurrentChat(res.chat);
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchAllChats(), fetchCurrentChat()]);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    } 
  };

  useEffect(() => {
    fetchData();
  }, [chatType, id]);

  const handleTypeChange = (type: "dm" | "community") => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("chatId");
    searchParams.delete("userId");
    searchParams.set("type", type);

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="barber-chat-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <ChatLayout
          userRole="barber"
          handleTypeChangeForPage={handleTypeChange}
        />
      </motion.div>
    </AnimatePresence>
  );
};
