import { fetchPostsForBarbers } from "@/services/barber/barberService";
import { ISinglePostResponse } from "@/types/Response";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetPostsForBarber = () => {
  return useInfiniteQuery({
    queryKey: ["listed-posts-on-barber"],
    queryFn: fetchPostsForBarbers,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 3) return undefined;
      return pages.length + 1;
    },
  });
};

export const useGetPostByPostId = (
  queryFunc: (postId: string) => Promise<ISinglePostResponse>,
  postId: string
) => {
  return useQuery<ISinglePostResponse>({
    queryKey: ["post"],
    queryFn: () => queryFunc(postId),
  });
};
