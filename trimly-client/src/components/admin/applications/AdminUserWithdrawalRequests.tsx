import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	BanknoteIcon,
	Check,
	CreditCard,
	X,
	MoreVertical,
	Filter,
	Search,
	CheckCircle,
	XCircle,
	Clock,
	ArrowUpDown,
	ExternalLink,
	Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IWithdrawal } from "@/types/Wallet";
import { useToaster } from "@/hooks/ui/useToaster";
import {
	useApproveWithdrawalMutation,
	useRejectWithdrawalMutation,
	useWithdrawalRequests,
} from "@/hooks/admin/useGetAllUserWithdrawals";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { WithdrawalDetailModal } from "@/components/modals/WithdrawDetailsModal";
import { formatDateTime } from "@/utils/helpers/timeFormatter";

const ITEMS_PER_PAGE = 10;

export const AdminUserWithdrawalRequests = () => {
	const { successToast, errorToast } = useToaster();
	const [selectedWithdrawal, setSelectedWithdrawal] =
		useState<IWithdrawal | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [methodFilter, setMethodFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sortField, setSortField] = useState<string>("requestedAt");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [page, setPage] = useState(1);
	const [localWithdrawals, setLocalWithdrawals] = useState<IWithdrawal[]>([]);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		setPage(1);
	}, [statusFilter, methodFilter, debouncedSearch, sortField, sortDirection]);

	const { data, isLoading, isError, refetch } = useWithdrawalRequests({
		page,
		limit: ITEMS_PER_PAGE,
		status: statusFilter,
		method: methodFilter,
		search: debouncedSearch,
		sortField,
		sortDirection,
	});
	const { mutate: adminApproveWithdrawal } = useApproveWithdrawalMutation();
	const { mutate: adminRejectWithdrawal } = useRejectWithdrawalMutation();

	useEffect(() => {
		if (data) {
			setLocalWithdrawals(data.withdrawals);
		}
	}, [data]);

	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleViewDetails = (withdrawal: IWithdrawal) => {
		setSelectedWithdrawal(withdrawal);
		setModalOpen(true);
	};

	const handleApproveWithdrawal = (withdrawalId: string) => {
		adminApproveWithdrawal(
			{ withdrawalId },
			{
				onSuccess: (data) => {
					successToast(data.message);
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);

		setLocalWithdrawals((prev) =>
			prev.map((w) =>
				w.withdrawalId === withdrawalId
					? {
							...w,
							status: "approved",
							processedAt: new Date(),
					  }
					: w
			)
		);
		setModalOpen(false);
		// refetch();
	};

	const handleRejectWithdrawal = (withdrawalId: string, remarks: string) => {
		adminRejectWithdrawal(
			{ withdrawalId, remarks },
			{
				onSuccess: (data) => {
					successToast(data.message);
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
		setLocalWithdrawals((prev) =>
			prev.map((w) =>
				w.withdrawalId === withdrawalId
					? {
							...w,
							status: "rejected",
							remarks,
							processedAt: new Date(),
					  }
					: w
			)
		);
		setModalOpen(false);

		// successToast("The withdrawal request has been rejected.");

		// refetch();
	};
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return (
					<Badge className="bg-green-500 flex items-center gap-1">
						<CheckCircle className="h-3 w-3" /> Approved
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-500 flex items-center gap-1">
						<Clock className="h-3 w-3" /> Pending
					</Badge>
				);
			case "rejected":
				return (
					<Badge className="bg-red-500 flex items-center gap-1">
						<XCircle className="h-3 w-3" /> Rejected
					</Badge>
				);
			default:
				return <Badge className="bg-gray-500">{status}</Badge>;
		}
	};

	const totalPages = data?.totalPages || 1;

	return (
		<div className="container mx-auto py-6 max-w-6xl">
			<Card className="shadow-lg gap-0 py-2 border-0">
				<CardHeader className="border-b bg-muted/40">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<CardTitle className="text-2xl font-bold">
								Withdrawal Requests
							</CardTitle>
							<CardDescription>
								Manage and process withdrawal requests from
								users
							</CardDescription>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<div className="flex items-center w-full md:w-auto">
								<div className="relative flex-1">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Search by name or ID..."
										className="pl-8 w-full md:w-[200px] h-9"
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Select
									value={statusFilter}
									onValueChange={setStatusFilter}>
									<SelectTrigger className="w-[130px] h-9">
										<Filter className="h-3.5 w-3.5 mr-1.5" />
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Status
										</SelectItem>
										<SelectItem value="pending">
											Pending
										</SelectItem>
										<SelectItem value="approved">
											Approved
										</SelectItem>
										<SelectItem value="rejected">
											Rejected
										</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={methodFilter}
									onValueChange={setMethodFilter}>
									<SelectTrigger className="w-[130px] h-9">
										<Filter className="h-3.5 w-3.5 mr-1.5" />
										<SelectValue placeholder="Method" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Methods
										</SelectItem>
										<SelectItem value="bank">
											Bank Transfer
										</SelectItem>
										<SelectItem value="upi">
											UPI Payment
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-muted/50 bg-muted/10">
									<TableHead className="w-fit">No.</TableHead>
									<TableHead className="w-[250px]">
										User
									</TableHead>
									<TableHead>
										<div
											className="flex items-center gap-1 cursor-pointer"
											onClick={() =>
												handleSort("requestedAt")
											}>
											Date
											<ArrowUpDown className="h-3.5 w-3.5" />
										</div>
									</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>
										<div
											className="flex items-center gap-1 cursor-pointer"
											onClick={() =>
												handleSort("amount")
											}>
											Amount
											<ArrowUpDown className="h-3.5 w-3.5" />
										</div>
									</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<AnimatePresence>
									{isLoading ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center">
												<div className="flex items-center justify-center">
													<Loader2 className="h-6 w-6 animate-spin mr-2" />
													Loading withdrawal
													requests...
												</div>
											</TableCell>
										</TableRow>
									) : isError ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center">
												<div className="text-red-500">
													Error loading withdrawal
													requests. Please try again.
												</div>
												<Button
													variant="outline"
													onClick={() => refetch()}
													className="mt-2">
													Retry
												</Button>
											</TableCell>
										</TableRow>
									) : localWithdrawals?.length > 0 ? (
										localWithdrawals?.map(
											(withdrawal, index) => (
												<motion.tr
													key={
														withdrawal.withdrawalId
													}
													initial={{
														opacity: 0,
														y: 5,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													exit={{ opacity: 0, y: -5 }}
													transition={{
														duration: 0.2,
													}}
													className="hover:bg-muted/40 group relative cursor-pointer"
													onClick={() =>
														handleViewDetails(
															withdrawal
														)
													}>
													<TableCell>
														<span>{index + 1}</span>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Avatar className="h-9 w-9 border">
																<AvatarImage
																	src={
																		withdrawal
																			.userDetails
																			?.avatar ||
																		"/placeholder.svg"
																	}
																	alt={
																		withdrawal
																			.userDetails
																			?.fullName
																	}
																/>
																<AvatarFallback>
																	{withdrawal.userDetails?.fullName?.charAt(
																		0
																	) || "U"}
																</AvatarFallback>
															</Avatar>
															<div>
																<p className="font-medium truncate">
																	{withdrawal
																		.userDetails
																		?.fullName ||
																		"User"}
																</p>
																<p className="text-xs text-muted-foreground">
																	ID:{" "}
																	{withdrawal.withdrawalId.slice(
																		0,
																		8
																	)}
																</p>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex flex-col">
															<span>
																{formatDateTime(
																	withdrawal.requestedAt?.toString() ||
																		""
																)}
															</span>
															<span className="text-xs text-muted-foreground">
																{withdrawal.processedAt &&
																	`Processed: ${formatDateTime(
																		withdrawal.processedAt?.toString() ||
																			""
																	)}`}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															{withdrawal.method ===
															"bank" ? (
																<>
																	<BanknoteIcon className="h-4 w-4 text-blue-500" />
																	<span>
																		Bank
																	</span>
																</>
															) : (
																<>
																	<CreditCard className="h-4 w-4 text-purple-500" />
																	<span>
																		UPI
																	</span>
																</>
															)}
														</div>
													</TableCell>
													<TableCell className="font-semibold">
														₹
														{withdrawal.amount.toLocaleString()}
													</TableCell>
													<TableCell>
														{getStatusBadge(
															withdrawal.status
														)}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end">
															{withdrawal.status ===
															"pending" ? (
																<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
																		onClick={(
																			e
																		) => {
																			e.stopPropagation();
																			handleViewDetails(
																				withdrawal
																			);
																			// Additional logic for reject could go here
																		}}>
																		<X className="h-4 w-4" />
																	</Button>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
																		onClick={(
																			e
																		) => {
																			e.stopPropagation();
																			handleApproveWithdrawal(
																				withdrawal.withdrawalId
																			);
																		}}>
																		<Check className="h-4 w-4" />
																	</Button>
																</div>
															) : (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8"
																	onClick={(
																		e
																	) => {
																		e.stopPropagation();
																		handleViewDetails(
																			withdrawal
																		);
																	}}>
																	<ExternalLink className="h-4 w-4" />
																</Button>
															)}
															<DropdownMenu>
																<DropdownMenuTrigger
																	asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8"
																		onClick={(
																			e
																		) =>
																			e.stopPropagation()
																		}>
																		<MoreVertical className="h-4 w-4" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem
																		onClick={(
																			e
																		) => {
																			e.stopPropagation();
																			handleViewDetails(
																				withdrawal
																			);
																		}}>
																		View
																		Details
																	</DropdownMenuItem>
																	{withdrawal.status ===
																		"pending" && (
																		<>
																			<DropdownMenuItem
																				onClick={(
																					e
																				) => {
																					e.stopPropagation();
																					handleApproveWithdrawal(
																						withdrawal.withdrawalId
																					);
																				}}
																				className="text-green-600">
																				Approve
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={(
																					e
																				) => {
																					e.stopPropagation();
																					handleViewDetails(
																						withdrawal
																					);
																					// The modal will handle rejection with remarks
																				}}
																				className="text-red-600">
																				Reject
																			</DropdownMenuItem>
																		</>
																	)}
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</TableCell>
												</motion.tr>
											)
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center">
												No withdrawal requests match
												your filters
											</TableCell>
										</TableRow>
									)}
								</AnimatePresence>
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					{!isLoading && !isError && localWithdrawals?.length > 0 && (
						<div className="flex justify-center py-4">
							<Pagination1
								currentPage={page}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			<WithdrawalDetailModal
				withdrawal={selectedWithdrawal}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onApprove={handleApproveWithdrawal}
				onReject={handleRejectWithdrawal}
			/>
		</div>
	);
};
