import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from '../../types/Response';
import { updateClientPassword } from "@/services/client/clientService";
import { UpdatePasswordData } from "@/types/User";

export const useClientPasswordUpdateMutation = () => {
  return useMutation<IAxiosResponse, Error, UpdatePasswordData>({
    mutationFn: updateClientPassword,
  });
};
