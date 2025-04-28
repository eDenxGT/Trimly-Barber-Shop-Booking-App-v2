import { IAllChatResponse, IChatResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useFetchChatById = (
  queryFunc: (id: string) => Promise<IChatResponse>,
  id: string,
) => {
  return useQuery<IChatResponse>({
    queryKey: ["chat", id],
    queryFn: () => queryFunc(id),
    enabled: !!id,
    placeholderData: (prev) => prev ?? undefined,
    retry: false,
  });
};

export const useFetchAllChatByUserId = (
  queryFunc: () => Promise<IAllChatResponse>
) => {
  return useQuery<IAllChatResponse>({
    queryKey: ["all-chats", queryFunc.name],
    queryFn: () => queryFunc(),
    placeholderData: (prev) => prev ?? undefined,
  });
};
