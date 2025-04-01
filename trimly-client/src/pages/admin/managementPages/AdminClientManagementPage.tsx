import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useToaster } from "@/hooks/ui/useToaster";
import { IClient } from "@/types/User";
import { ClientManagementComponent } from "@/components/admin/managements/AdminClientManagement";
import { getAllUsers } from "@/services/admin/adminService";
import { useAllUsersQuery } from "@/hooks/admin/useAllUsers";
import { useUpdateUserStatusMutation } from "@/hooks/admin/useUpdateUserStatus";

export const AdminClientManagementPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 10;

	const { mutate: updateUserStatus } = useUpdateUserStatusMutation();
	const { errorToast, successToast } = useToaster();

	useEffect(() => {
		const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
		handler();
		return () => handler.cancel();
	}, [searchQuery]);

	const { data, isLoading, isError } = useAllUsersQuery<IClient>(
		getAllUsers,
		currentPage,
		limit,
		debouncedSearch,
		"client"
	);

	const clients = data?.users || [];
	const totalPages = data?.totalPages || 1;

	const handleStatusClick = async (userId: string) => {
		try {
			await updateUserStatus(
				{
					userType: "client",
					userId,
				},
				{
					onSuccess: (data) => {
						successToast(data.message);
					},
					onError: (error: any) => {
						errorToast(error.response.data.message);
					},
				}
			);
		} catch (error: any) {
			errorToast(
				error.response?.data?.message || "Failed to update status."
			);
		}
	};

	return (
		<ClientManagementComponent
			clients={clients}
			totalPages={totalPages}
			currentPage={currentPage}
			isLoading={isLoading}
			isError={isError}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			onPageChange={setCurrentPage}
			onStatusUpdate={handleStatusClick}
		/>
	);
};
