import { joinCommunity } from "@/services/barber/barberService";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useJoinCommunityMutation = () => {
  return useMutation<IAxiosResponse, Error, { communityId: string }>({
    mutationFn: joinCommunity,
  });
};
