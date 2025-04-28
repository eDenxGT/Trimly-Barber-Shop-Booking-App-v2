import { createContext, useContext, useEffect, useState } from "react";
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
  const [currentChat, setCurrentChatData] = useState<
    IDirectChat | ICommunityChat | null
  >(null);
  const [chatType, setChatType] = useState<"dm" | "community">("dm");
  const [messages, setMessages] = useState<
    (IDirectMessage | ICommunityMessage)[]
  >([]);
  const [allChats, setAllChatsData] = useState<
    IDirectChatPreview[] | ICommunityChatPreview[]
  >([]);

  const socket = useSocket();
  const { infoToast } = useToaster();
  const user: IBarber | IClient | null = useSelector(getCurrentUserDetails);

  useEffect(() => {
    console.log("allChats:", allChats);
  }, [allChats]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (
      newMessage: IDirectMessage | ICommunityMessage
    ) => {
      //   if (!currentChat) return;

      if (chatType === "dm") {
        if (
          (newMessage as IDirectMessage)?.chatRoomId ===
          (currentChat as IDirectChat)?.chatRoomId
        ) {
          setMessages((prevMessages) => {
            if (
              !prevMessages.find(
                (message) => message.messageId === newMessage.messageId
              )
            ) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        } else {
          infoToast(`You received a DM: ${newMessage.content}`);
        }
        if (allChats.length > 0 && chatType === "dm") {
          setAllChatsData((prevChats) => {
            const chatsArray = [...(prevChats as IDirectChatPreview[])];
            const chatIndex = chatsArray.findIndex(
              (chat) =>
                "chatRoomId" in chat &&
                chat.chatRoomId === (newMessage as IDirectMessage).chatRoomId
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

              return [
                chatWithNewMessage,
                ...chatsArray,
              ] as IDirectChatPreview[];
            }
            return chatsArray as IDirectChatPreview[];
          });
        }
      } else if (
        (newMessage as ICommunityMessage).communityId ===
        (currentChat as ICommunityChat).communityId
      ) {
        setMessages((prevMessages) => {
          if (
            !prevMessages.find(
              (message) => message.messageId === newMessage.messageId
            )
          ) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      } else {
        infoToast(`New community message received!`);
      }
    };

    socket.on("direct-chat:receive-message", handleReceiveMessage);

    return () => {
      socket.off("direct-chat:receive-message", handleReceiveMessage);
    };
  }, [socket, currentChat, chatType]);

  // const setAllChats = (
  //   chats: IDirectChatPreview[] | ICommunityChatPreview[]
  // ) => {
  //   if (allChats.length === 0 || allChats.length !== chats.length) {
  //     setAllChatsData(chats);
  //   }
  // };

  const setAllChats = (
    chats: IDirectChatPreview[] | ICommunityChatPreview[]
  ) => {
    console.log("Setting all chats:", chats);
    // Always update the chats instead of checking lengths
    setAllChatsData(chats);
  };

  // const setCurrentChat = (chat: IDirectChat | ICommunityChat) => {
  //   setCurrentChatData(chat);
  //   if (
  //     messages.length === 0 ||
  //     (chat.messages && chat.messages.length > messages.length)
  //   ) {
  //     setMessages(chat.messages || []);
  //   }
  // };

  const setCurrentChat = (chat: IDirectChat | ICommunityChat) => {
    setCurrentChatData(chat);
    // Always update messages when changing chats
    setMessages(chat.messages || []);
  };

  const onTypeChange = (type: "dm" | "community") => {
    setChatType(type);
    setCurrentChatData(null);
    setAllChatsData([]);
    setMessages([]);
  };

  const sendMessage = (content: string, imageUrl?: string) => {
    if (!socket || !currentChat || !chatType || !user) return;
    console.log("Sending message:", content, imageUrl);

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
      setMessages((prev) => [...prev, newMessage]);

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
      console.log(newMessage);

      socket.emit("community-chat:send-message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleChangeChat = () => {
    setCurrentChatData(null);
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
