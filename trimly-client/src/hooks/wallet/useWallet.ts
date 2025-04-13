import { IAxiosResponse, IWalletPageResponse } from "@/types/Response";
import { WithdrawRequestDTO } from "@/types/Wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWallet = (queryFunc: () => Promise<IWalletPageResponse>) => {
  return useQuery<IWalletPageResponse>({
    queryKey: ["wallet-page"],
    queryFn: () => queryFunc(),
    placeholderData: (prev) => prev ?? undefined,
  });
};

export const useWithDrawMutation = (
  mutationFunc: (payload: WithdrawRequestDTO) => Promise<IAxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, WithdrawRequestDTO>({
    mutationFn: (payload) => mutationFunc(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-page"] });
    },
  });
};
