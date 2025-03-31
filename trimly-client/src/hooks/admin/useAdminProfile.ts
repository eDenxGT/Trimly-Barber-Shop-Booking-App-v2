import {
	IUpdateAdminData,
	updateAdminProfile,
} from "@/services/admin/adminService";
import { IAuthResponse } from "@/types/Response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAdminProfileMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAuthResponse, Error, IUpdateAdminData>({
		mutationFn: updateAdminProfile,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["admin-profile"] }),
	});
};
