import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "@/types/Response";
import { IBookingPayload } from "@/types/Booking";
import { paymentWithWallet } from "@/services/client/clientService";
import { useQueryClient } from "@tanstack/react-query";

export const useWalletPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAxiosResponse, Error, IBookingPayload>({
    mutationFn: paymentWithWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["barber-details"],
        exact: false,
      });
    },
  });
};
