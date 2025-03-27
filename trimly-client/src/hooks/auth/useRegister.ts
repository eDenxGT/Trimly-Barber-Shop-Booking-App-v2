import { signup } from './../../services/auth/authService';
import { UserDTO } from '@/types/User';
import { IAxiosResponse } from '@/types/Response';
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
   return useMutation<IAxiosResponse, Error, UserDTO>({
     mutationFn: signup,
   });
 };