import { signin } from "@/services/auth/authService"
import { IAuthResponse } from "@/types/Response"
import { ILoginData } from "@/types/User"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
   return useMutation<IAuthResponse, Error, ILoginData>({
      mutationFn: signin
   })
}