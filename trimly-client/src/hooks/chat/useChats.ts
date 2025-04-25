import { IChatResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useFetchChatByChatId = (
  queryFunc: (chatId: string) => Promise<IChatResponse>,
  chatId: string
) => {
  return useQuery<IChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: () => queryFunc(chatId),
    placeholderData: (prev) => prev ?? undefined,
  });
};

export const useFetchChatByUserId = (
  queryFunc: (userId: string) => Promise<IChatResponse>,
  userId: string
) => {
  return useQuery<IChatResponse>({
    queryKey: ["chat", userId],
    queryFn: () => queryFunc(userId),
    enabled: !!userId,
    placeholderData: (prev) => prev ?? undefined,
    retry: false,
  });
};
