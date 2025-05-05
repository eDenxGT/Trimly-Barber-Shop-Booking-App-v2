import { useMutation } from "@tanstack/react-query";
import { IHairstyle } from "@/types/Hairstyle";
import { IAxiosResponse } from "@/types/Response";
import {
  addHairstyle,
  deleteHairstyle,
  updateHairstyle,
} from "@/services/admin/adminService";
import { useQueryClient } from "@tanstack/react-query";

export const useAddHairstyleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAxiosResponse, Error, Partial<IHairstyle>>({
    mutationFn: addHairstyle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "all-hairstyles",
      });
    },
  });
};

export const useUpdateHairstyleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAxiosResponse, Error, Partial<IHairstyle>>({
    mutationFn: updateHairstyle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "all-hairstyles",
      });
    },
  });
};

export const useDeleteHairstyleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAxiosResponse, Error, { hairstyleId: string }>({
    mutationFn: deleteHairstyle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "all-hairstyles",
      });
    },
  });
};
