import { fetchPostsForBarbers } from "@/services/barber/barberService";
import { fetchPostsForClients } from "@/services/client/clientService";
import { ISinglePostResponse } from "@/types/Response";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetPostsForBarber = () => {
  return useInfiniteQuery({
    queryKey: ["listed-posts-on-barber"],
    queryFn: fetchPostsForBarbers,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 9) return undefined;
      return pages.length + 1;
    },
  });
};

export const useGetPostsForClient = () => {
  return useInfiniteQuery({
    queryKey: ["listed-posts-on-client"],
    queryFn: fetchPostsForClients,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 3) return undefined;
      return pages.length + 1;
    },
  });
};

export const useGetPostByPostId = (
  queryFunc: (postId: string, forType: string) => Promise<ISinglePostResponse>,
  postId: string,
  forType: string
) => {
  return useQuery<ISinglePostResponse>({
    queryKey: ["post", postId],
    queryFn: () => queryFunc(postId, forType),
    enabled: !!postId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    retry: 1,
  });
};
