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

export const useToggleLikePost = (
  mutationFn: ({ postId }: { postId: string }) => Promise<IAxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, { postId: string }>({
    mutationFn,
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["listed-posts-on-barber"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listed-posts-on-client"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
  });
};

export const usePostComment = (
  mutationFn: ({
    postId,
    comment,
  }: {
    postId: string;
    comment: string;
  }) => Promise<IAxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    IAxiosResponse,
    Error,
    { postId: string; comment: string }
  >({
    mutationFn,
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
  });
};

export const useToggleCommentLike = (
  mutationFn: ({
    commentId,
    postId,
  }: {
    commentId: string;
    postId: string;
  }) => Promise<IAxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    IAxiosResponse,
    Error,
    { commentId: string; postId: string }
  >({
    mutationFn,
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
  });
};
