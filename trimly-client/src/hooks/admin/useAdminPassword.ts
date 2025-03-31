import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from './../../types/Response';
import { updateAdminPassword } from "@/services/admin/adminService";
import { UpdatePasswordData } from "@/types/User";

export const useAdminPasswordUpdateMutation = () => {
  return useMutation<IAxiosResponse, Error, UpdatePasswordData>({
    mutationFn: updateAdminPassword,
  });
};
