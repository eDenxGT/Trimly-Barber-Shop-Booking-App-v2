import type React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { IClient } from "@/types/User";

interface ClientManagementProps {
	clients: IClient[];
	totalPages: number;
	currentPage: number;
	isLoading: boolean;
	isError: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onPageChange: (page: number) => void;
	onStatusUpdate: (userId: string) => Promise<void>;
}

export const ClientManagementComponent: React.FC<ClientManagementProps> = ({
	clients,
	totalPages,
	currentPage,
	isLoading,
	isError,
	searchQuery,
	onSearchChange,
	onPageChange,
	onStatusUpdate,
}) => {
	const getInitials = (firstName: string) => {
		return `${firstName.charAt(0)}`.toUpperCase();
	};

	return (
		<div className="min-h-screen mt-14 bg-gray-200">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6 text-gray-800">
					Client Management
				</h1>

				{/* Search Input */}
				<div className="mb-6 flex items-center relative">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={18}
					/>
					<Input
						type="text"
						placeholder="Search clients..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 bg-white border border-gray-200 rounded-md"
					/>
				</div>

				{/* Clients Table */}
				{isLoading ? (
					<div className="text-center py-8">
						<p className="text-gray-500">Loading clients...</p>
					</div>
				) : isError ? (
					<div className="text-center py-8">
						<p className="text-red-500">Failed to load clients.</p>
					</div>
				) : clients.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No clients found.</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<Table>
							<TableHeader className="bg-gray-50">
								<TableRow>
									<TableHead className="w-12">No.</TableHead>
									<TableHead>Client</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{clients.map((client, index) => (
									<TableRow
										key={client.userId}
										className="hover:bg-gray-50">
										<TableCell className="font-medium">
											{(currentPage - 1) * 10 + index + 1}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10 bg-gray-200">
													{client.avatar ? (
														<AvatarImage
															src={client.avatar}
															alt={
																client.fullName
															}
														/>
													) : (
														<AvatarFallback>
															{getInitials(
																client.fullName as string
															)}
														</AvatarFallback>
													)}
												</Avatar>
												<div>
													<p className="font-medium">{`${client.fullName}`}</p>
													{client.userId && (
														<p className="text-sm text-gray-500">
															{client.userId.slice(
																0,
																20
															) + "..."}
														</p>
													)}
												</div>
											</div>
										</TableCell>

										<TableCell className="text-gray-600">
											{client.email}
										</TableCell>
										<TableCell className="text-gray-600">
											{client.phoneNumber}
										</TableCell>
										<TableCell>
											<Button
												variant={"outline"}
												size="sm"
												className={
													client.status === "active"
														? "bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer border-green-200"
														: "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer border-red-200"
												}
												onClick={() =>
													onStatusUpdate(
														client.userId as string
													)
												}>
												{client.status === "active"
													? "Active"
													: "Blocked"}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Pagination */}
				<div className="mt-6 flex justify-center items-center">
					
					<Pagination1
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</div>
			</div>
		</div>
	);
};
