import { IWalletPageResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useWallet = (queryFunc: () => Promise<IWalletPageResponse>) => {
  return useQuery<IWalletPageResponse>({
    queryKey: ["wallet-page"],
    queryFn: () => queryFunc(),
    placeholderData: (prev) => prev ?? undefined,
  });
};
