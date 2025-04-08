import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { IBarber } from "@/types/User";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { BarberShopDetailsModal } from "@/components/modals/BarberShopDetailsModal";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

interface BarberShopApplicationComponentProps {
	shops: IBarber[];
	totalPages: number;
	currentPage: number;
	isLoading: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onPageChange: (page: number) => void;
	onUpdateStatus: (
		id: string,
		status: string,
		message?: string
	) => Promise<void>;
}

export const BarberShopApplicationComponent = ({
	shops,
	totalPages,
	currentPage,
	isLoading,
	searchQuery,
	onSearchChange,
	onPageChange,
	onUpdateStatus,
}: BarberShopApplicationComponentProps) => {
	const [isDarkMode] = useState(false);
	const [selectedShop, setSelectedShop] = useState<IBarber | null>(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
		useState(false);
	const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
	const [rejectionMessage, setRejectionMessage] = useState("");
	const [confirmationData, setConfirmationData] = useState({
		title: "",
		description: "",
		confirmText: "",
		confirmVariant: "destructive" as
			| "default"
			| "destructive"
			| "outline"
			| "secondary"
			| "ghost"
			| "link",
		action: "",
	});
	const limit = 10;

	const handleViewShopDetails = (shop: IBarber) => {
		setSelectedShop(shop);
		setIsDetailsModalOpen(true);
	};

	const handleConfirmationModal = (
		shop: IBarber,
		action: "approve" | "blocked"
	) => {
		setSelectedShop(shop);

		if (action === "approve") {
			setConfirmationData({
				title: "Approve Barber Shop",
				description: `Are you sure you want to approve "${shop.shopName}"? This will make the shop visible to customers.`,
				confirmText: "Approve",
				confirmVariant: "default",
				action: "approve",
			});
			setIsConfirmationModalOpen(true);
		} else {
			setIsRejectionModalOpen(true);
		}
	};

	const handleConfirmAction = async () => {
		if (!selectedShop) return;

		const updatedStatus =
			confirmationData.action === "approve" ? "active" : "blocked";

		await onUpdateStatus(selectedShop.userId as string, updatedStatus);

		setIsConfirmationModalOpen(false);
		setSelectedShop(null);
		setIsDetailsModalOpen(false);
	};

	const handleRejectSubmit = async () => {
		if (!selectedShop) return;

		await onUpdateStatus(
			selectedShop.userId as string,
			"blocked",
			rejectionMessage
		);

		setIsRejectionModalOpen(false);
		setRejectionMessage("");
		setSelectedShop(null);
		setIsDetailsModalOpen(false);
	};
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-400 text-green-900 hover:bg-green-500">
						Approved
					</Badge>
				);
			case "blocked":
				return (
					<Badge className="bg-red-500 text-white hover:bg-red-600">
						Blocked
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
						Pending
					</Badge>
				);
			default:
				return (
					<Badge className="bg-gray-400 text-gray-900 hover:bg-gray-500">
						Unknown
					</Badge>
				);
		}
	};

	return (
		<div
			className={`p-6 mt-16 ${
				isDarkMode
					? "bg-gray-900 text-white"
					: "bg-gray-100 text-gray-900"
			} min-h-screen`}>
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-black">
						Barber Shop Applications
					</h1>
				</div>

				{/* Search and Filter */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							size={18}
						/>
						<Input
							placeholder="Search by shop name, or email..."
							className={`pl-10 ${
								isDarkMode
									? "bg-gray-800 border-gray-700 text-white"
									: "bg-white border-gray-300"
							}`}
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				</div>

				{/* Shops Table */}
				<div
					className={`rounded-lg overflow-hidden ${
						isDarkMode ? "bg-gray-800" : "bg-white"
					} shadow-md`}>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead
								className={`${
									isDarkMode
										? "bg-gray-700 text-gray-200"
										: "bg-gray-50 text-gray-600"
								}`}>
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
										Shop
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
										Contact
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
										Location
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody
								className={`divide-y ${
									isDarkMode
										? "divide-gray-700"
										: "divide-gray-200"
								}`}>
								{isLoading ? (
									<tr>
										<td
											colSpan={5}
											className={`px-6 py-12 text-center ${
												isDarkMode
													? "text-gray-400"
													: "text-gray-500"
											}`}>
											Loading...
										</td>
									</tr>
								) : shops.length > 0 ? (
									shops.map((shop) => (
										<tr
											key={shop.userId}
											className={
												isDarkMode
													? "hover:bg-gray-700"
													: "hover:bg-gray-50"
											}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<Avatar className="h-10 w-10 bg-orange-100 mr-3">
														<AvatarImage
															src={shop.avatar}
															alt={shop.shopName}
														/>
														<AvatarFallback className="bg-orange-100 text-orange-800">
															<Store className="h-5 w-5" />
														</AvatarFallback>
													</Avatar>
													<div>
														<div
															className={`font-medium ${
																isDarkMode
																	? "text-white"
																	: "text-gray-900"
															}`}>
															{shop.shopName}
														</div>
														<div className="text-sm text-gray-500">
															ID:{" "}
															{(
																shop.userId as string
															).substring(0, 8)}
															...
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div
													className={
														isDarkMode
															? "text-white"
															: "text-gray-900"
													}>
													{shop.email}
												</div>
												<div className="text-sm text-gray-500">
													{shop.phoneNumber}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div
													className={
														isDarkMode
															? "text-white"
															: "text-gray-900"
													}>
													{shop.location &&
														shop.location.name}
													,{" "}
													{shop.location &&
														shop.location.zipCode}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{getStatusBadge(
													shop.status as string
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Button
													variant="ghost"
													className="text-orange-500 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-gray-700"
													onClick={() =>
														handleViewShopDetails(
															shop
														)
													}>
													View Details
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={5}
											className={`px-6 py-12 text-center ${
												isDarkMode
													? "text-gray-400"
													: "text-gray-500"
											}`}>
											No pending shop applications found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Pagination */}
				{shops.length >= limit && (
					<Pagination1
						currentPage={currentPage}
						totalPages={totalPages}
						onPageNext={() => onPageChange(currentPage + 1)}
						onPagePrev={() => onPageChange(currentPage - 1)}
					/>
				)}

				{/* Modals */}
				<BarberShopDetailsModal
					isOpen={isDetailsModalOpen}
					onOpenChange={setIsDetailsModalOpen}
					selectedShop={selectedShop}
					handleConfirmationModal={handleConfirmationModal}
				/>

				<ConfirmationModal
					isOpen={isConfirmationModalOpen}
					onClose={() => setIsConfirmationModalOpen(false)}
					onConfirm={handleConfirmAction}
					title={confirmationData.title}
					description={confirmationData.description}
					confirmText={confirmationData.confirmText}
					cancelText="Cancel"
					confirmVariant={confirmationData.confirmVariant}
				/>

				{/* Separate Rejection Modal */}
				<Dialog
					open={isRejectionModalOpen}
					onOpenChange={setIsRejectionModalOpen}>
					<DialogContent
						className={isDarkMode ? "bg-gray-800 text-white" : ""}>
						<DialogHeader>
							<DialogTitle>Reject Barber Shop</DialogTitle>
						</DialogHeader>
						<div className="py-4">
							<p className="mb-4">
								Are you sure you want to reject "
								{selectedShop?.shopName}"?
							</p>
							<div className="space-y-2">
								<p className="text-sm font-medium">
									Rejection Reason (will be sent to barber via
									email):
								</p>
								<Textarea
									placeholder="Please provide a reason for the rejection..."
									value={rejectionMessage}
									onChange={(
										e: React.ChangeEvent<HTMLTextAreaElement>
									) => setRejectionMessage(e.target.value)}
									className={`mt-1 ${
										isDarkMode
											? "bg-gray-700 border-gray-600"
											: ""
									}`}
									rows={4}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => {
									setIsRejectionModalOpen(false);
									setRejectionMessage("");
								}}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleRejectSubmit}
								disabled={!rejectionMessage.trim()}>
								Reject
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};
