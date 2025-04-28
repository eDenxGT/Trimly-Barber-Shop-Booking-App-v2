import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useToaster } from "@/hooks/ui/useToaster";
import {
  IDirectChat,
  IDirectMessage,
  ICommunityChat,
  ICommunityMessage,
  IDirectChatPreview,
  ICommunityChatPreview,
} from "@/types/Chat";
import { IBarber, IClient } from "@/types/User";
import { useSelector } from "react-redux";
import { getCurrentUserDetails } from "@/utils/helpers/getCurrentUser";
import { generateUniqueId } from "@/utils/helpers/generateUniqueId";

type ChatContextType = {
  currentChat: IDirectChat | ICommunityChat | null;
  chatType: "dm" | "community";
  setCurrentChat: (chat: IDirectChat | ICommunityChat) => void;
  allChats: IDirectChatPreview[] | ICommunityChatPreview[];
  setAllChats: (chats: IDirectChatPreview[] | ICommunityChatPreview[]) => void;
  onTypeChange: (type: "dm" | "community") => void;
  messages: (IDirectMessage | ICommunityMessage)[];
  handleChangeChat: () => void;
  sendMessage: (content: string, imageUrl?: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const typeFromUrl = searchParams.get("type");
  const [currentChat, setCurrentChatData] = useState<
    IDirectChat | ICommunityChat | null
  >(null);
  const [chatType, setChatType] = useState<"dm" | "community">(
    (typeFromUrl as "dm" | "community") || "dm"
  );

  const [messages, setMessages] = useState<
    (IDirectMessage | ICommunityMessage)[]
  >([]);
  const [allChats, setAllChatsData] = useState<
    IDirectChatPreview[] | ICommunityChatPreview[]
  >([]);

  // Using refs to prevent infinite update loops
  const currentChatRef = useRef<IDirectChat | ICommunityChat | null>(null);
  const messagesRef = useRef<(IDirectMessage | ICommunityMessage)[]>([]);

  // Update refs when states change
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Chat ID for tracking changes
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const socket = useSocket();
  const { infoToast } = useToaster();
  const user: IBarber | IClient | null = useSelector(getCurrentUserDetails);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveDirectMessage = (newMessage: IDirectMessage) => {
      if (chatType === "dm") {
        const currentDirectChat = currentChatRef.current as IDirectChat | null;

        if (
          currentDirectChat &&
          newMessage.chatRoomId === currentDirectChat.chatRoomId
        ) {
          // Add message only if it doesn't exist
          if (
            !messagesRef.current.find(
              (msg) => msg.messageId === newMessage.messageId
            )
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        } else {
          infoToast(`You received a DM: ${newMessage.content}`);
        }

        if (allChats.length > 0 && chatType === "dm") {
          setAllChatsData((prevChats) => {
            const chatsArray = [...(prevChats as IDirectChatPreview[])];
            const chatIndex = chatsArray.findIndex(
              (chat) =>
                "chatRoomId" in chat &&
                chat.chatRoomId === newMessage.chatRoomId
            );

            if (chatIndex > -1) {
              const updatedChat = chatsArray.splice(chatIndex, 1)[0];
              const chatWithNewMessage = {
                ...updatedChat,
                lastMessage: {
                  senderId: newMessage.senderId,
                  content: newMessage.content,
                  messageType: newMessage.messageType,
                  timestamp: newMessage.timestamp,
                  mediaUrl: newMessage.mediaUrl,
                },
              } as IDirectChatPreview;

              return [chatWithNewMessage, ...chatsArray];
            }
            return chatsArray;
          });
        }
      } else {
        infoToast(`You received a DM: ${newMessage.content}`);
      }
    };

    const handleReceiveCommunityMessage = (newMessage: ICommunityMessage) => {
      if (chatType === "community") {
        const currentCommunityChat =
          currentChatRef.current as ICommunityChat | null;

        if (
          currentCommunityChat &&
          newMessage.communityId === currentCommunityChat.communityId
        ) {
          // Add message only if it doesn't exist
          if (
            !messagesRef.current.find(
              (msg) => msg.messageId === newMessage.messageId
            )
          ) {
            console.log("neewwwwww", newMessage);
            setMessages((prev) => [...prev, newMessage]);
          }
        } else {
          infoToast(`New community message received!`);
        }
      } else {
        infoToast(`New community message received!`);
      }
    };

    // Listeners
    socket.on("direct-chat:receive-message", handleReceiveDirectMessage);
    socket.on("community-chat:receive-message", handleReceiveCommunityMessage);

    return () => {
      socket.off("direct-chat:receive-message", handleReceiveDirectMessage);
      socket.off(
        "community-chat:receive-message",
        handleReceiveCommunityMessage
      );
    };
  }, [socket, chatType, allChats, infoToast]); // Removed currentChat and messages from deps

  const setAllChats = (
    chats: IDirectChatPreview[] | ICommunityChatPreview[]
  ) => {
    setAllChatsData(chats);
  };

  const setCurrentChat = (chat: IDirectChat | ICommunityChat) => {
    const chatId = "chatRoomId" in chat ? chat.chatRoomId : chat.communityId;

    // Only reset messages if we're changing to a different chat
    if (currentChatId !== chatId) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      setCurrentChatData(chat);
    } else {
      // Update the chat without affecting messages
      setCurrentChatData(chat);
    }
  };

  const onTypeChange = (type: "dm" | "community") => {
    setChatType(type);
    setCurrentChatData(null);
    setCurrentChatId(null);
    setMessages([]);
  };

  const sendMessage = (content: string, imageUrl?: string) => {
    if (!socket || !currentChat || !chatType || !user) return;

    const currentUserId = user.userId || "";
    const senderName =
      user.role === "barber"
        ? (user as IBarber).shopName
        : (user as IClient).fullName;
    const senderAvatar = user.avatar || "/placeholder.svg";

    if (chatType === "dm") {
      const directChat = currentChat as IDirectChat;
      const newMessage: IDirectMessage = {
        messageId: generateUniqueId("direct-message"),
        chatRoomId: directChat.chatRoomId,
        senderId: currentUserId,
        receiverId: directChat.participant.userId || "",
        messageType: imageUrl ? "image" : "text",
        content,
        mediaUrl: imageUrl,
        timestamp: new Date(),
        status: "sent",
      };

      socket.emit("direct-chat:send-message", newMessage);

      // Add message to state
      setMessages((prev) => [...prev, newMessage]);

      // Update allChats with the new last message
      setAllChatsData((prevChats) => {
        const chatsArray = [...(prevChats as IDirectChatPreview[])];
        const chatIndex = chatsArray.findIndex(
          (chat) => chat.chatRoomId === directChat.chatRoomId
        );

        if (chatIndex > -1) {
          const updatedChat = chatsArray.splice(chatIndex, 1)[0];
          const chatWithNewMessage = {
            ...updatedChat,
            lastMessage: {
              senderId: newMessage.senderId,
              content: newMessage.content,
              messageType: newMessage.messageType,
              timestamp: newMessage.timestamp,
              mediaUrl: newMessage.mediaUrl,
            },
          };

          return [chatWithNewMessage, ...chatsArray];
        }
        return chatsArray;
      });
    } else {
      const communityChat = currentChat as ICommunityChat;
      const newMessage: ICommunityMessage = {
        messageId: generateUniqueId("community-message"),
        communityId: communityChat.communityId,
        senderId: currentUserId,
        messageType: imageUrl ? "image" : "text",
        content,
        mediaUrl: imageUrl,
        timestamp: new Date(),
        status: "sent",
        readBy: [currentUserId],
        senderName: senderName || "User",
        senderAvatar,
      };

      socket.emit("community-chat:send-message", newMessage);

      // Add message to state
      setMessages((prev) => [...prev, newMessage]);

      setAllChatsData((prevChats) => {
        if (chatType !== "community") return prevChats;

        const chatsArray = [...(prevChats as ICommunityChatPreview[])];
        const chatIndex = chatsArray.findIndex(
          (chat) => chat.communityId === communityChat.communityId
        );

        if (chatIndex > -1) {
          const updatedChat = chatsArray.splice(chatIndex, 1)[0];
          const chatWithNewMessage: ICommunityChatPreview = {
            ...updatedChat,
            lastMessage: {
              senderDetails: {
                userId: newMessage.senderId,
                name: newMessage.senderName,
                profileImageUrl: newMessage.senderAvatar,
              },
              content: newMessage.content,
              messageType: newMessage.messageType,
              timestamp: newMessage.timestamp,
              mediaUrl: newMessage.mediaUrl,
            },
          };

          return [chatWithNewMessage, ...chatsArray];
        }
        return chatsArray;
      });
    }
  };

  const handleChangeChat = () => {
    setCurrentChatData(null);
    setCurrentChatId(null);
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        allChats,
        setAllChats,
        chatType,
        handleChangeChat,
        setCurrentChat,
        onTypeChange,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};
