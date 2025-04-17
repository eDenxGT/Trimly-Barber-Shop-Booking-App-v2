import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	Calendar,
	CircleCheck,
	CircleX,
	Clock,
	CreditCard,
	Eye,
	FileText,
	LoaderCircle,
	Receipt,
	Wallet,
} from "lucide-react";
import type { ITransaction } from "@/types/Wallet";
import {
	formatDateTime,
	getSmartDate,
} from "../../utils/helpers/timeFormatter";
import { UserTransactionDetailsDialog } from "./UserTransactionDialog";

export type TransactionType = "credit" | "debit";
export type TransactionSource = "booking" | "topup" | "withdrawal" | "refund";
export type TransactionStatus = "pending" | "success" | "failed" | "processing";

interface TransactionHistoryProps {
	transactions: ITransaction[];
	title?: string;
	className?: string;
	maxHeight?: string;
	showFilter?: boolean;
	initialFilter?: TransactionSource | "all";
}

export function TransactionHistory({
	transactions,
	title = "Transaction History",
	className = "",
	maxHeight = "400px",
	showFilter = true,
	initialFilter = "all",
}: TransactionHistoryProps) {
	const [filter, setFilter] = useState<TransactionSource | "all">(
		initialFilter
	);
	const [selectedTransaction, setSelectedTransaction] =
		useState<ITransaction | null>(null);
	const filteredTransactions =
		filter === "all"
			? transactions
			: transactions.filter((t) => t.source === filter);

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

	const getSourceIcon = (source: TransactionSource) => {
		switch (source) {
			case "booking":
				return <Calendar className="h-4 w-4" />;
			case "topup":
				return <CreditCard className="h-4 w-4" />;
			case "withdrawal":
				return <Wallet className="h-4 w-4" />;
			case "refund":
				return <Receipt className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	const handleOpenDetails = (transaction: ITransaction) => {
		setSelectedTransaction(transaction);
	};

	const handleCloseDetails = () => {
		setSelectedTransaction(null);
	};

	return (
		<>
			<Card className={className}>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl flex items-center gap-2">
						<FileText className="h-5 w-5" />
						{title}
					</CardTitle>
					{showFilter && (
						<Select
							defaultValue={initialFilter}
							onValueChange={(value) =>
								setFilter(value as TransactionSource | "all")
							}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Transactions
								</SelectItem>
								<SelectItem value="booking">
									Bookings
								</SelectItem>
								<SelectItem value="topup">Top Ups</SelectItem>
								<SelectItem value="withdrawal">
									Withdrawals
								</SelectItem>
								<SelectItem value="refund">Refunds</SelectItem>
							</SelectContent>
						</Select>
					)}
				</CardHeader>
				<CardContent>
					<div
						className={`overflow-auto rounded-md border`}
						style={{ maxHeight }}>
						<Table>
							<TableHeader className="bg-muted/50">
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Source</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">
										Amount
									</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<AnimatePresence>
									{filteredTransactions.length > 0 ? (
										filteredTransactions.map(
											(transaction) => (
												<motion.tr
													key={
														transaction.transactionId
													}
													initial={{
														opacity: 0,
														y: 5,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													exit={{ opacity: 0 }}
													transition={{
														duration: 0.2,
													}}
													className="group hover:bg-muted/30">
													<TableCell className="font-medium">
														<div className="flex flex-col">
															<span className="text-sm">
																{formatDateTime(
																	transaction?.createdAt?.toString()
																)}
															</span>
															<span className="text-xs text-muted-foreground flex items-center gap-1">
																<Clock className="h-3 w-3" />
																{getSmartDate(
																	transaction?.createdAt?.toString()
																)}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															{transaction.type ===
															"credit" ? (
																<Badge
																	variant="outline"
																	className="border-green-500 bg-green-50 text-green-700 flex items-center gap-1">
																	<ArrowDownCircle className="h-3 w-3" />{" "}
																	Credit
																</Badge>
															) : (
																<Badge
																	variant="outline"
																	className="border-red-500 bg-red-50 text-red-700 flex items-center gap-1">
																	<ArrowUpCircle className="h-3 w-3" />{" "}
																	Debit
																</Badge>
															)}
														</div>
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={
																transaction.source ===
																"booking"
																	? "border-amber-500 bg-amber-50 text-amber-800 flex items-center gap-1"
																	: transaction.source ===
																	  "topup"
																	? "border-cyan-500 bg-cyan-50 text-cyan-800 flex items-center gap-1"
																	: transaction.source ===
																	  "withdrawal"
																	? "border-blue-500 bg-blue-50 text-blue-800 flex items-center gap-1"
																	: "border-purple-500 bg-purple-50 text-purple-800 flex items-center gap-1"
															}>
															{getSourceIcon(
																transaction.source
															)}
															{transaction.source
																.charAt(0)
																.toUpperCase() +
																transaction.source.slice(
																	1
																)}
														</Badge>
													</TableCell>
													<TableCell>
														{getStatusBadgeForTransaction(
															transaction.status
														)}
													</TableCell>
													<TableCell className="text-right font-medium">
														<div className="flex items-center justify-end gap-1">
															<span
																className={
																	transaction.type ===
																	"credit"
																		? "text-green-600"
																		: "text-red-600"
																}>
																{transaction.type ===
																"credit"
																	? "+"
																	: "-"}
																₹
																{transaction?.amount?.toLocaleString()}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="icon"
															className="opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																handleOpenDetails(
																	transaction
																)
															}>
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</motion.tr>
											)
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-10 text-muted-foreground">
												<div className="flex flex-col items-center gap-2">
													<FileText className="h-10 w-10 text-muted-foreground/50" />
													<p>No transactions found</p>
												</div>
											</TableCell>
										</TableRow>
									)}
								</AnimatePresence>
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<UserTransactionDetailsDialog
				selectedTransaction={selectedTransaction}
				onClose={handleCloseDetails}
			/>
		</>
	);
}
