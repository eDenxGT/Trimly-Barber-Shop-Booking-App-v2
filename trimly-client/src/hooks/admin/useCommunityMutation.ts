import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "@/types/Response";
import { ICommunityChat } from "@/types/Chat";
import { adminCreateCommunity } from "@/services/admin/adminService";

export const useCreateCommunityMutation = () => {
  return useMutation<IAxiosResponse, Error, Partial<ICommunityChat>>({
    mutationFn: adminCreateCommunity,
  });
};
