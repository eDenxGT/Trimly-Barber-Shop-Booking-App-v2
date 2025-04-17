import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	FileText,
	ArrowDownCircle,
	ArrowUpCircle,
	ExternalLink,
	CircleCheck,
	LoaderCircle,
	CircleX,
} from "lucide-react";
import { ITransaction } from "@/types/Wallet";
import { formatDateTime, getSmartDate } from "@/utils/helpers/timeFormatter";
import { Badge } from "../ui/badge";

interface Props {
	selectedTransaction: ITransaction | null;
	onClose: () => void;
}

export function UserTransactionDetailsDialog({
	selectedTransaction,
	onClose,
}: Props) {
	const getStatusBadgeForTransaction = (status: string) => {
		switch (status) {
			case "success":
				return (
					<Badge
						variant="outline"
						className="border-green-500 text-green-500 flex items-center gap-1">
						<CircleCheck className="h-3 w-3" /> Success
					</Badge>
				);
			case "pending":
				return (
					<Badge
						variant="outline"
						className="border-yellow-500 text-yellow-500 flex items-center gap-1">
						<LoaderCircle className="h-3 w-3 animate-spin" />{" "}
						Pending
					</Badge>
				);
			case "failed":
				return (
					<Badge
						variant="outline"
						className="border-red-500 text-red-500 flex items-center gap-1">
						<CircleX className="h-3 w-3" /> Failed
					</Badge>
				);
			case "processing":
				return (
					<Badge
						variant="outline"
						className="border-blue-500 text-blue-500 flex items-center gap-1">
						<LoaderCircle className="h-3 w-3 animate-spin" />{" "}
						Processing
					</Badge>
				);
			default:
				return (
					<Badge
						variant="outline"
						className="border-gray-500 text-gray-500">
						{status || "Unknown"}
					</Badge>
				);
		}
	};
	return (
		<Dialog
			open={!!selectedTransaction}
			onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Transaction Details
					</DialogTitle>
					<DialogDescription>
						Complete information about this transaction
					</DialogDescription>
				</DialogHeader>

				{selectedTransaction && (
					<div className="space-y-6 pt-3">
						{/* Top Row: Transaction ID + Status */}
						<div className="flex justify-between items-center border-b pb-4">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Transaction ID
								</p>
								<p className="text-sm font-mono">
									{selectedTransaction.transactionId}
								</p>
							</div>
							{getStatusBadgeForTransaction(
								selectedTransaction.status
							)}
						</div>

						{/* Amount and Type Icon */}
						<div className="bg-muted/30 p-4 rounded-lg border flex justify-between items-center">
							<div>
								<p className="text-sm text-muted-foreground">
									Amount
								</p>
								<p
									className={`text-2xl font-bold ${
										selectedTransaction.type === "credit"
											? "text-green-600"
											: "text-red-600"
									}`}>
									{selectedTransaction.type === "credit"
										? "+"
										: "-"}
									₹
									{selectedTransaction.amount.toLocaleString()}
								</p>
							</div>
							<div
								className={`p-3 rounded-full ${
									selectedTransaction.type === "credit"
										? "bg-green-100"
										: "bg-red-100"
								}`}>
								{selectedTransaction.type === "credit" ? (
									<ArrowDownCircle className="h-6 w-6 text-green-600" />
								) : (
									<ArrowUpCircle className="h-6 w-6 text-red-600" />
								)}
							</div>
						</div>

						{/* Transaction Metadata */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Date
								</p>
								<p className="text-sm">
									{formatDateTime(
										selectedTransaction.createdAt?.toString()
									)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Time
								</p>
								<p className="text-sm">
									{getSmartDate(
										selectedTransaction.createdAt?.toString()
									)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Type
								</p>
								<p className="text-sm capitalize">
									{selectedTransaction.type}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Source
								</p>
								<p className="text-sm capitalize">
									{selectedTransaction.source}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									User ID
								</p>
								<p className="text-sm font-mono truncate">
									{selectedTransaction.userId}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Wallet ID
								</p>
								<p className="text-sm font-mono truncate">
									{selectedTransaction.walletId}
								</p>
							</div>
						</div>

						{/* Optional Fields */}
						{selectedTransaction.orderId && (
							<div className="space-y-1 pt-2 border-t">
								<p className="text-sm font-medium text-muted-foreground">
									Order ID
								</p>
								<p className="text-sm font-mono">
									{selectedTransaction.orderId}
								</p>
							</div>
						)}

						{selectedTransaction.referenceId && (
							<div className="space-y-1 pt-2 border-t">
								<p className="text-sm font-medium text-muted-foreground">
									Reference ID
								</p>
								<p className="text-sm font-mono">
									{selectedTransaction.referenceId}
								</p>
							</div>
						)}

						{/* Close Button */}
						<div className="flex justify-end pt-4">
							<Button
								variant="outline"
								className="flex items-center gap-2"
								size="sm"
								onClick={onClose}>
								<ExternalLink className="h-3.5 w-3.5" />
								Close
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
