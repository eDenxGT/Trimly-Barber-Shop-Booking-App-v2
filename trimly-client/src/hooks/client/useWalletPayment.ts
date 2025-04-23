import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "@/types/Response";
import { IBookingPayload } from "@/types/Booking";
import { paymentWithWallet } from "@/services/client/clientService";

export const useWalletPaymentMutation = () => {
  return useMutation<IAxiosResponse, Error, IBookingPayload>({
    mutationFn: paymentWithWallet,
  });
};
