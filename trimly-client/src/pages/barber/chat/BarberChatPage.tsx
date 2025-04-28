import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/contexts/ChatContext";
import {
  useFetchAllChatByUserId,
  useFetchChatById,
} from "@/hooks/chat/useChats";
import {
  getAllChatsByBarberId,
  getAllCommunityChatsByBarberId,
  getChatByChatIdForBarber,
  getChatByUserIdForBarber,
  getCommunityChatByChatIdForBarber,
} from "@/services/barber/barberService";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const BarberChatPage = () => {
  const { setAllChats, setCurrentChat, chatType } = useChat();
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { userIdFromUrl, chatIdFromUrl } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      userIdFromUrl: params.get("userId"),
      chatIdFromUrl: params.get("chatId"),
    };
  }, [location.search]);

  const id = chatIdFromUrl || userIdFromUrl;
  const queryFunc = chatIdFromUrl
    ? chatType === "community"
      ? getCommunityChatByChatIdForBarber
      : getChatByChatIdForBarber
    : getChatByUserIdForBarber;

  const allChatsQueryFn =
    chatType === "community"
      ? getAllCommunityChatsByBarberId
      : getAllChatsByBarberId;

  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: allChatsError,
  } = useFetchAllChatByUserId(allChatsQueryFn);

  const {
    data: chatRes,
    isLoading: chatByIdLoading,
    isError: chatByIdError,
  } = useFetchChatById(queryFunc, id || "");


  useEffect(() => {
    if (allChatsData?.chats) {
      setAllChats(allChatsData.chats);
    }
  }, [allChatsData, setAllChats, chatType]);

  useEffect(() => {
    if (chatRes?.chat) {
      setCurrentChat(chatRes.chat);
    }
  }, [chatRes, setCurrentChat]);

  const handleTypeChange = (type: "dm" | "community") => {
    queryClient.invalidateQueries({ queryKey: ["all-chats"] });
    queryClient.invalidateQueries({ queryKey: ["chat"] });

    queryClient.removeQueries({
      queryKey: [
        "all-chats",
        type === "community"
          ? "getAllChatsByBarberId"
          : "getAllCommunityChatsByBarberId",
      ],
    });

    if (id) {
      queryClient.removeQueries({ queryKey: ["chat", id] });
    }

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("chatId");
    searchParams.delete("userId");
    searchParams.set("type", type);

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
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
            userRole="barber"
            handleTypeChangeForPage={handleTypeChange}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
