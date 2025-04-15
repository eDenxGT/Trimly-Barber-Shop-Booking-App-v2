import { addPost, editPost } from "@/services/barber/barberService";
import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "@/types/Response";
import { IPostFormData } from "@/types/Feed";

export const useAddPost = () => {
  return useMutation<IAxiosResponse, Error, IPostFormData>({
    mutationFn: addPost,
  });
};

export const useEditPost = () => {
  return useMutation<
    IAxiosResponse,
    Error,
    { payload: IPostFormData; postId: string }
  >({
    mutationFn: ({ payload, postId }) => editPost({ payload, postId }),
  });
};
