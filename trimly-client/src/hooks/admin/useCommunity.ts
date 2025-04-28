import { useMutation, useQuery } from "@tanstack/react-query";
import { IAllCommunitiesResponse, IAxiosResponse, ICommunityChatResponse } from "@/types/Response";
import { ICommunityChat } from "@/types/Chat";
import {
  adminCreateCommunity,
  adminEditCommunity,
  adminGetAllCommunities,
  adminGetCommunityById,
} from "@/services/admin/adminService";

export const useCreateCommunityMutation = () => {
  return useMutation<IAxiosResponse, Error, Partial<ICommunityChat>>({
    mutationFn: adminCreateCommunity,
  });
};

export const useEditCommunityMutation = () => {
  return useMutation<IAxiosResponse, Error, Partial<ICommunityChat>>({
    mutationFn: adminEditCommunity,
  });
};

export const useGetCommunityForEdit = (communityId: string) => {
  return useQuery<ICommunityChatResponse>({
    queryKey: ["community", communityId],
    queryFn: () => adminGetCommunityById(communityId),
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
