import {
  addPost,
  deletePost,
  editPost,
  updatePostStatus,
} from "@/services/barber/barberService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, { postId: string }>({
    mutationFn: ({ postId }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listed-posts-on-barber"] });
    },
  });
};

export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, { postId: string }>({
    mutationFn: ({ postId }) => updatePostStatus(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listed-posts-on-barber"] });
    },
  });
};
