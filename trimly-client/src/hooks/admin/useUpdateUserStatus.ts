import { IAxiosResponse } from "@/types/Response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from './../../services/admin/adminService';

export const useUpdateUserStatusMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<
		IAxiosResponse,
		Error,
		{ userType: string; userId: string }
	>({
		mutationFn: updateUserStatus,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});
};
