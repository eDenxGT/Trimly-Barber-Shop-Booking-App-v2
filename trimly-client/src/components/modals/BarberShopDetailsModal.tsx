import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, MapPin, Phone, Mail, Clock } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { IBarber } from "@/types/User";
import { formatDate } from "@/utils/helpers/timeFormatter";

interface BarberShopModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	selectedShop: IBarber | null;
	isDarkMode: boolean;
	handleConfirmationModal: (
		shop: IBarber,
		action: "approve" | "blocked"
	) => void;
}

export const BarberShopDetailsModal = ({
	isOpen,
	onOpenChange,
	selectedShop,
	isDarkMode,
	handleConfirmationModal,
}: BarberShopModalProps) => {
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-400 text-green-900">
						Active
					</Badge>
				);
			case "blocked":
				return <Badge className="bg-red-500 text-white">Blocked</Badge>;
			case "pending":
				return (
					<Badge className="bg-yellow-400 text-yellow-900">
						Pending
					</Badge>
				);
			default:
				return (
					<Badge className="bg-gray-400 text-gray-900">Unknown</Badge>
				);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={isDarkMode ? "bg-gray-800 text-white" : ""}>
				<DialogHeader>
					<DialogTitle>
						{selectedShop?.shopName || "Shop Details"}
					</DialogTitle>
				</DialogHeader>

				{selectedShop && (
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={selectedShop.avatar}
									alt={selectedShop.shopName}
								/>
								<AvatarFallback className="bg-orange-100 text-orange-800">
									<Store className="h-6 w-6" />
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-lg font-semibold">
									{selectedShop.shopName}
								</p>
								<p className="text-sm text-gray-500">
									Shop ID: {selectedShop.userId}
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium">Status:</p>
							{getStatusBadge(selectedShop.status as string)}
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium flex items-center gap-2">
								<Phone className="w-4 h-4" /> Contact Number:
							</p>
							<p>{selectedShop.phoneNumber || "N/A"}</p>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium flex items-center gap-2">
								<Mail className="w-4 h-4" /> Email:
							</p>
							<p>{selectedShop.email || "N/A"}</p>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium flex items-center gap-2">
								<MapPin className="w-4 h-4" /> Location:
							</p>
							<p>
								{(selectedShop.location &&
									selectedShop.location.displayName) ||
									"N/A"}
							</p>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium flex items-center gap-2">
								<Clock className="w-4 h-4" /> Registered On:
							</p>
							<p>
								{formatDate(
									(selectedShop.createdAt as Date).toString()
								)}
							</p>
						</div>
					</div>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() =>
							handleConfirmationModal(selectedShop!, "blocked")
						}
						className="bg-red-500 text-white hover:bg-red-600">
						Reject
					</Button>
					<Button
						variant="default"
						onClick={() =>
							handleConfirmationModal(selectedShop!, "approve")
						}
						className="bg-green-500 text-white text-center hover:bg-green-600">
						Approve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
