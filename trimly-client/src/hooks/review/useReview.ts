import { IAxiosResponse } from "@/types/Response";
import { ReviewDTO } from "@/types/Review";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReviewOnBarber } from "@/services/client/clientService";

export const useReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, ReviewDTO>({
    mutationFn: postReviewOnBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barber-details"] });
    },
  });
};
