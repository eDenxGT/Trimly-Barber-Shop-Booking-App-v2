import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IAllCommunitiesResponse,
  IAxiosResponse,
  ICommunityChatResponse,
} from "@/types/Response";
import { ICommunityChat } from "@/types/Chat";
import {
  adminCreateCommunity,
  adminDeleteCommunity,
  adminEditCommunity,
  adminGetCommunityById,
  adminToggleCommunityStatus,
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

export const useCommunityStatusToggle = () => {
  return useMutation<IAxiosResponse, Error, { communityId: string }>({
    mutationFn: adminToggleCommunityStatus,
  });
};

export const useDeleteCommunity = () => {
  return useMutation<IAxiosResponse, Error, { communityId: string }>({
    mutationFn: adminDeleteCommunity,
  });
};

export const useGetAllCommunities = ({
  queryFn,
  search,
  page,
  limit,
}: {
  queryFn: (params: {
    search: string;
    page: number;
    limit: number;
  }) => Promise<IAllCommunitiesResponse>;
  search: string;
  page: number;
  limit: number;
}) => {
  return useQuery<IAllCommunitiesResponse, Error>({
    queryKey: ["communities", search, page, limit],
    queryFn: () => queryFn({ search, page, limit }),
  });
};
