import {
	approveWithdrawal,
	fetchUserWithdrawals,
	rejectWithdrawal,
} from "@/services/admin/adminService";
import { IAxiosResponse } from "@/types/Response";
import { WithdrawalQueryParams } from "@/types/Wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWithdrawalRequests = (params: WithdrawalQueryParams) => {
	return useQuery({
		queryKey: ["withdrawal-requests", params],
		queryFn: () => fetchUserWithdrawals(params),
	});
};

export const useRejectWithdrawalMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<
		IAxiosResponse,
		Error,
		{ withdrawalId: string; remarks: string }
	>({
		mutationFn: ({ withdrawalId, remarks }) =>
			rejectWithdrawal(withdrawalId, remarks),
		onSuccess: () => {
			queryClient.invalidateQueries({
				// queryKey: ["withdrawal-requests"],
			});
		},
	});
};

export const useApproveWithdrawalMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAxiosResponse, Error, { withdrawalId: string }>({
		mutationFn: ({ withdrawalId }) => approveWithdrawal(withdrawalId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				// queryKey: ["withdrawal-requests"],
			});
		},
	});
};
