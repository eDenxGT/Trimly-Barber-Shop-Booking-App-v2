import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, BanknoteIcon, CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";
import { IWithdrawal } from "@/types/Wallet";

interface WithdrawalDetailModalProps {
	withdrawal: IWithdrawal | null;
	isOpen: boolean;
	onClose: () => void;
	onApprove: (withdrawalId: string) => void;
	onReject: (withdrawalId: string, remarks: string) => void;
}

export function WithdrawalDetailModal({
	withdrawal,
	isOpen,
	onClose,
	onApprove,
	onReject,
}: WithdrawalDetailModalProps) {
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [remarks, setRemarks] = useState("");

	if (!withdrawal) return null;

	const formatDateTime = (date?: Date | string) => {
		if (!date) return "N/A";
		return format(new Date(date), "MMM dd, yyyy 'at' hh:mm a");
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return <Badge className="bg-green-500">Approved</Badge>;
			case "pending":
				return <Badge className="bg-yellow-500">Pending</Badge>;
			case "rejected":
				return <Badge className="bg-red-500">Rejected</Badge>;
			default:
				return <Badge className="bg-gray-500">{status}</Badge>;
		}
	};

	const handleReject = () => {
		onReject(withdrawal.withdrawalId, remarks);
		setRemarks("");
		setRejectDialogOpen(false);
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold mb-2">
							Withdrawal Request Details
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						{/* User Info */}
						<div className="flex items-center space-x-4">
							<Avatar className="h-12 w-12 border">
								<AvatarImage
									src={
										withdrawal.userDetails?.avatar ||
										"/placeholder.svg"
									}
									alt={withdrawal.userDetails?.fullName}
								/>
								<AvatarFallback>
									{withdrawal.userDetails?.fullName?.charAt(
										0
									) || "U"}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-semibold">
									{withdrawal.userDetails?.fullName || "User"}
								</h3>
								<p className="text-sm text-muted-foreground">
									{withdrawal.userType
										.charAt(0)
										.toUpperCase() +
										withdrawal.userType.slice(1)}
								</p>
							</div>
						</div>

						{/* Status and Amount */}
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-muted p-3 rounded-lg">
								<p className="text-sm text-muted-foreground">
									Status
								</p>
								<div className="mt-1">
									{getStatusBadge(withdrawal.status)}
								</div>
							</div>
							<div className="bg-muted p-3 rounded-lg">
								<p className="text-sm text-muted-foreground">
									Amount
								</p>
								<p className="text-lg font-semibold">
									₹{withdrawal.amount.toLocaleString()}
								</p>
							</div>
						</div>

						{/* Payment Method */}
						<div className="bg-muted p-4 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								{withdrawal.method === "bank" ? (
									<BanknoteIcon className="h-5 w-5 text-blue-500" />
								) : (
									<CreditCard className="h-5 w-5 text-purple-500" />
								)}
								<h3 className="font-medium">
									{withdrawal.method === "bank"
										? "Bank Transfer"
										: "UPI Payment"}
								</h3>
							</div>

							{withdrawal.method === "bank" ? (
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Account Holder
										</span>
										<span className="font-medium">
											{withdrawal.accountHolderName}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Account Number
										</span>
										<span className="font-medium">
											{withdrawal.accountNumber}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Bank Name
										</span>
										<span className="font-medium">
											{withdrawal.bankName}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											IFSC Code
										</span>
										<span className="font-medium">
											{withdrawal.ifscCode}
										</span>
									</div>
								</div>
							) : (
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											UPI ID
										</span>
										<span className="font-medium">
											{withdrawal.upiId}
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Timestamps */}
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Requested:
								</span>
								<span>
									{formatDateTime(withdrawal.requestedAt)}
								</span>
							</div>
							{withdrawal.processedAt && (
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">
										Processed:
									</span>
									<span>
										{formatDateTime(withdrawal.processedAt)}
									</span>
								</div>
							)}
						</div>

						{/* Remarks if rejected */}
						{withdrawal.status === "rejected" &&
							withdrawal.remarks && (
								<div className="bg-red-50 p-3 rounded-lg border border-red-200">
									<p className="text-sm font-medium text-red-800 mb-1">
										Rejection Reason
									</p>
									<p className="text-sm text-red-700">
										{withdrawal.remarks}
									</p>
								</div>
							)}
					</div>

					{withdrawal.status === "pending" && (
						<DialogFooter className="flex justify-end gap-2 mt-4">
							<Button
								variant="outline"
								className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
								onClick={() => setRejectDialogOpen(true)}>
								<X className="mr-2 h-4 w-4" /> Reject
							</Button>
							<Button
								className="bg-green-500 hover:bg-green-600 text-white"
								onClick={() =>
									onApprove(withdrawal.withdrawalId)
								}>
								<Check className="mr-2 h-4 w-4" /> Approve
							</Button>
						</DialogFooter>
					)}
				</DialogContent>
			</Dialog>

			{/* Rejection Dialog */}
			<AlertDialog
				open={rejectDialogOpen}
				onOpenChange={setRejectDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Reject Withdrawal Request
						</AlertDialogTitle>
						<AlertDialogDescription>
							Please provide a reason for rejecting this
							withdrawal request. This will be visible to the
							user.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="my-2">
						<Textarea
							placeholder="Enter rejection reason..."
							value={remarks}
							onChange={(e) => setRemarks(e.target.value)}
							className="min-h-[120px]"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 hover:bg-red-600"
							onClick={handleReject}>
							Reject Request
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
