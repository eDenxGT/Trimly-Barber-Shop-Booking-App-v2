import { useMutation, useQuery } from "@tanstack/react-query";
import { IAllCommunitiesResponse, IAxiosResponse } from "@/types/Response";
import { ICommunityChat } from "@/types/Chat";
import {
  adminCreateCommunity,
  adminGetAllCommunities,
} from "@/services/admin/adminService";

export const useCreateCommunityMutation = () => {
  return useMutation<IAxiosResponse, Error, Partial<ICommunityChat>>({
    mutationFn: adminCreateCommunity,
  });
};

export const useGetAllCommunities = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery<IAllCommunitiesResponse, Error>({
    queryKey: ["communities", page, limit],
    queryFn: () =>
      adminGetAllCommunities({
        page,
        limit,
      }),
  });
};
