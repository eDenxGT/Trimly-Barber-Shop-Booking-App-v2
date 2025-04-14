import { addPost } from "@/services/barber/barberService";
import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "@/types/Response";
import { IPostFormData } from "@/types/Feed";

export const useAddPost = () => {
  return useMutation<IAxiosResponse, Error, IPostFormData>({
    mutationFn: addPost,
  });
};
