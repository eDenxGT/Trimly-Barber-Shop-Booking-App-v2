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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { IBarber } from "@/types/User";

interface BarberShopManagementProps {
	barbers: IBarber[];
	totalPages: number;
	currentPage: number;
	isLoading: boolean;
	isError: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onPageChange: (page: number) => void;
	onStatusUpdate: (userId: string) => Promise<void>;
}

export const BarberShopManagementComponent: React.FC<
	BarberShopManagementProps
> = ({
	barbers,
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
						placeholder="Search shops..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 bg-white border border-gray-200 rounded-md"
					/>
				</div>

				{/* Clients Table */}
				{isLoading ? (
					<div className="text-center py-8">
						<p className="text-gray-500">Loading shops...</p>
					</div>
				) : isError ? (
					<div className="text-center py-8">
						<p className="text-red-500">Failed to load shops.</p>
					</div>
				) : barbers.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No shops found.</p>
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
								{barbers.map((barber, index) => (
									<TableRow
										key={barber.userId}
										className="hover:bg-gray-50">
										<TableCell className="font-medium">
											{(currentPage - 1) * 10 + index + 1}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10 bg-gray-200">
													<AvatarFallback>
														{getInitials(
															barber.shopName as string
														)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{`${barber.shopName}`}</p>
													{barber.userId && (
														<p className="text-sm text-gray-500">
															{barber.userId.slice(
																0,
																20
															) + "..."}
														</p>
													)}
												</div>
											</div>
										</TableCell>

										<TableCell className="text-gray-600">
											{barber.email}
										</TableCell>
										<TableCell className="text-gray-600">
											{barber.phoneNumber}
										</TableCell>
										<TableCell>
											<Button
												variant={"outline"}
												size="sm"
												className={
													barber.status === "active"
														? "bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer border-green-200"
														: "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer border-red-200"
												}
												onClick={() =>
													onStatusUpdate(
														barber.userId as string
													)
												}>
												{barber.status === "active"
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
						onPageNext={() => onPageChange(currentPage + 1)}
						onPagePrev={() => onPageChange(currentPage - 1)}
					/>
				</div>
			</div>
		</div>
	);
};
