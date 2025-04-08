import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
	CalendarIcon,
	Clock,
	Phone,
	Check,
	Scissors,
	Calendar as CalendarFull,
	List,
	Grid,
	Info,
	Clock3,
	MapPin,
	MessageSquare,
	X,
	RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToaster } from "@/hooks/ui/useToaster";

// Sample booking data - in a real app, this would come from an API
const SAMPLE_BOOKINGS = [
	{
		id: "1",
		time: "09:00 AM",
		duration: "45 min",
		clientName: "John Smith",
		serviceName: "Haircut & Beard Trim",
		phoneNumber: "(555) 123-4567",
		status: "confirmed",
		price: "$45",
		clientAvatar: null,
		notes: "Prefers scissor cut on top, #2 on sides",
		preferredBarber: "You",
		lastVisit: "3 weeks ago",
		location: "Main Salon",
	},
	{
		id: "2",
		time: "10:30 AM",
		duration: "30 min",
		clientName: "Michael Johnson",
		serviceName: "Fade Haircut",
		phoneNumber: "(555) 234-5678",
		status: "confirmed",
		price: "$35",
		clientAvatar: null,
		notes: "Mid fade, leave 1 inch on top",
		preferredBarber: "You",
		lastVisit: "1 month ago",
		location: "Main Salon",
	},
	{
		id: "3",
		time: "12:00 PM",
		duration: "20 min",
		clientName: "David Williams",
		serviceName: "Beard Trim",
		phoneNumber: "(555) 345-6789",
		status: "pending",
		price: "$20",
		clientAvatar: null,
		notes: "Shape beard, trim mustache",
		preferredBarber: "You",
		lastVisit: "2 months ago",
		location: "Main Salon",
	},
	{
		id: "4",
		time: "01:30 PM",
		duration: "1 hour",
		clientName: "Robert Brown",
		serviceName: "Haircut & Styling",
		phoneNumber: "(555) 456-7890",
		status: "confirmed",
		price: "$55",
		clientAvatar: null,
		notes: "Textured crop, style with matte product",
		preferredBarber: "You",
		lastVisit: "6 weeks ago",
		location: "Main Salon",
	},
	{
		id: "5",
		time: "03:00 PM",
		duration: "45 min",
		clientName: "James Davis",
		serviceName: "Hot Towel Shave",
		phoneNumber: "(555) 567-8901",
		status: "cancelled",
		price: "$40",
		clientAvatar: null,
		notes: "Traditional straight razor shave",
		preferredBarber: "You",
		lastVisit: "2 weeks ago",
		location: "Main Salon",
	},
	{
		id: "6",
		time: "04:30 PM",
		duration: "40 min",
		clientName: "Thomas Wilson",
		serviceName: "Haircut",
		phoneNumber: "(555) 678-9012",
		status: "confirmed",
		price: "$30",
		clientAvatar: null,
		notes: "Regular customer, usual style",
		preferredBarber: "You",
		lastVisit: "1 month ago",
		location: "Main Salon",
	},
];

// Status badge colors and styles
const statusConfig = {
	confirmed: {
		className:
			"bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
		icon: null,
	},
	pending: {
		className:
			"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
		icon: null,
	},
	cancelled: {
		className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
		icon: <X className="h-3 w-3 mr-1" />,
	},
	finished: {
		className:
			"bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
		icon: <Check className="h-3 w-3 mr-1" />,
	},
};

export function BarberBookingsList() {
	const [date, setDate] = useState<Date>(new Date());
	const [bookings, setBookings] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"grid" | "list" | "timeline">(
		"grid"
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { successToast, errorToast, infoToast } = useToaster();

	// Simulate fetching bookings for the selected date
	useEffect(() => {
		setIsLoading(true);

		// Simulate API call delay
		const timer = setTimeout(() => {
			// In a real app, you would fetch bookings for the selected date from an API
			const shouldShowEmpty = Math.random() > 0.8;
			setBookings(shouldShowEmpty ? [] : SAMPLE_BOOKINGS);
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [date]);

	// Handle refreshing data
	const refreshData = () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setBookings(SAMPLE_BOOKINGS);
			setIsRefreshing(false);
			successToast("Bookings refreshed successfully");
		}, 1000);
	};

	// Handle marking a booking as finished
	const markAsFinished = (bookingId: string) => {
		setBookings((prevBookings) =>
			prevBookings.map((booking) =>
				booking.id === bookingId
					? { ...booking, status: "finished" }
					: booking
			)
		);
		errorToast("Appointment marked as finished");
	};

	// Handle cancelling a booking
	const cancelBooking = (bookingId: string) => {
		setBookings((prevBookings) =>
			prevBookings.map((booking) =>
				booking.id === bookingId
					? { ...booking, status: "cancelled" }
					: booking
			)
		);
		infoToast("Appointment cancelled");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
			<header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
				<div className="container mx-auto px-4 py-4 md:px-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div className="flex items-center">
							<div className="bg-indigo-600 text-white p-2 rounded-md mr-3">
								<Scissors className="h-6 w-6" />
							</div>
							<div>
								<h1 className="text-2xl font-bold tracking-tight text-slate-800">
									BarberPro
								</h1>
								<p className="text-slate-500 text-sm">
									Appointment Management
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full sm:w-auto justify-start text-left font-normal border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900",
											!date && "text-slate-500"
										)}>
										<CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
										{date ? (
											format(date, "EEEE, MMMM d, yyyy")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="end">
									<Calendar
										mode="single"
										selected={date}
										onSelect={(newDate) =>
											newDate && setDate(newDate)
										}
										initialFocus
										className="rounded-md border-indigo-200"
									/>
								</PopoverContent>
							</Popover>

							<Button
								variant="ghost"
								size="icon"
								onClick={refreshData}
								disabled={isRefreshing}
								className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
								<RefreshCw
									className={cn(
										"h-5 w-5",
										isRefreshing && "animate-spin"
									)}
								/>
							</Button>

							<div className="bg-slate-100 rounded-lg p-1 ml-auto md:ml-0">
								<Tabs defaultValue="grid" value={viewMode}>
									<TabsList className="grid grid-cols-3 h-8 w-auto">
										<TabsTrigger
											value="grid"
											onClick={() => setViewMode("grid")}
											className={cn(
												viewMode === "grid" &&
													"bg-white shadow-sm"
											)}>
											<Grid className="h-4 w-4" />
										</TabsTrigger>
										<TabsTrigger
											value="list"
											onClick={() => setViewMode("list")}
											className={cn(
												viewMode === "list" &&
													"bg-white shadow-sm"
											)}>
											<List className="h-4 w-4" />
										</TabsTrigger>
										<TabsTrigger
											value="timeline"
											onClick={() =>
												setViewMode("timeline")
											}
											className={cn(
												viewMode === "timeline" &&
													"bg-white shadow-sm"
											)}>
											<CalendarFull className="h-4 w-4" />
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto py-6 px-4 md:px-6">
				{isLoading ? (
					<LoadingState viewMode={viewMode} />
				) : bookings.length === 0 ? (
					<EmptyState date={date} setDate={setDate} />
				) : (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-medium text-slate-700">
								{bookings.length} Appointments •{" "}
								{format(date, "MMMM d, yyyy")}
							</h2>
						</div>

						{viewMode === "grid" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{bookings.map((booking) => (
									<BookingCard
										key={booking.id}
										booking={booking}
										markAsFinished={markAsFinished}
										cancelBooking={cancelBooking}
									/>
								))}
							</div>
						)}

						{viewMode === "list" && (
							<div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50">
												<th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Time
												</th>
												<th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Client
												</th>
												<th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Service
												</th>
												<th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Price
												</th>
												<th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Status
												</th>
												<th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-200">
											{bookings.map((booking) => (
												<tr
													key={booking.id}
													className="hover:bg-slate-50 transition-colors">
													<td className="py-3 px-4 text-sm">
														<div className="font-medium text-slate-900">
															{booking.time}
														</div>
														<div className="text-slate-500 text-xs">
															{booking.duration}
														</div>
													</td>
													<td className="py-3 px-4 text-sm">
														<div className="flex items-center">
															<div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
																{booking.clientName.charAt(
																	0
																)}
															</div>
															<div>
																<div className="font-medium text-slate-900">
																	{
																		booking.clientName
																	}
																</div>
																<div className="text-slate-500 text-xs">
																	{
																		booking.phoneNumber
																	}
																</div>
															</div>
														</div>
													</td>
													<td className="py-3 px-4 text-sm text-slate-900">
														{booking.serviceName}
													</td>
													<td className="py-3 px-4 text-sm font-medium text-slate-900">
														{booking.price}
													</td>
													<td className="py-3 px-4 text-sm">
														<Badge
															variant="outline"
															className={cn(
																"capitalize text-xs px-2 py-0.5",
																statusConfig[
																	booking.status as keyof typeof statusConfig
																].className
															)}>
															{
																statusConfig[
																	booking.status as keyof typeof statusConfig
																].icon
															}
															{booking.status}
														</Badge>
													</td>
													<td className="py-3 px-4 text-sm text-right space-x-2 whitespace-nowrap">
														<BookingDetailsDialog
															booking={booking}
														/>

														{booking.status !==
															"finished" &&
															booking.status !==
																"cancelled" && (
																<>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			cancelBooking(
																				booking.id
																			)
																		}
																		className="text-slate-600 hover:text-red-600 hover:bg-red-50 h-8">
																		<X className="h-4 w-4 mr-1" />
																		Cancel
																	</Button>
																	<Button
																		size="sm"
																		onClick={() =>
																			markAsFinished(
																				booking.id
																			)
																		}
																		className="bg-emerald-600 hover:bg-emerald-700 text-white h-8">
																		<Check className="h-4 w-4 mr-1" />
																		Complete
																	</Button>
																</>
															)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{viewMode === "timeline" && (
							<div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
								<div className="relative">
									<div className="absolute left-9 top-0 bottom-0 w-px bg-slate-200"></div>
									<div className="space-y-6">
										{bookings.map((booking) => (
											<div
												key={booking.id}
												className="relative flex gap-4">
												<div className="absolute left-0 w-18 text-right text-sm font-medium text-slate-700 pt-0.5">
													{booking.time}
												</div>
												<div
													className={cn(
														"absolute left-9 top-1 w-2.5 h-2.5 rounded-full -translate-x-1/2 z-10",
														booking.status ===
															"cancelled"
															? "bg-red-500"
															: booking.status ===
															  "finished"
															? "bg-emerald-500"
															: booking.status ===
															  "pending"
															? "bg-amber-500"
															: "bg-blue-500"
													)}></div>
												<div className="ml-20 flex-1">
													<div
														className={cn(
															"bg-white rounded-lg border p-4 transition-all",
															booking.status ===
																"cancelled"
																? "border-red-200"
																: booking.status ===
																  "finished"
																? "border-emerald-200"
																: booking.status ===
																  "pending"
																? "border-amber-200"
																: "border-blue-200"
														)}>
														<div className="flex justify-between items-start">
															<div>
																<div className="font-medium text-slate-900">
																	{
																		booking.serviceName
																	}
																</div>
																<div className="text-sm text-slate-500">
																	{
																		booking.clientName
																	}{" "}
																	•{" "}
																	{
																		booking.duration
																	}
																</div>
															</div>
															<Badge
																variant="outline"
																className={cn(
																	"capitalize text-xs px-2 py-0.5",
																	statusConfig[
																		booking.status as keyof typeof statusConfig
																	].className
																)}>
																{
																	statusConfig[
																		booking.status as keyof typeof statusConfig
																	].icon
																}
																{booking.status}
															</Badge>
														</div>
														<div className="mt-3 flex items-center gap-3">
															<BookingDetailsDialog
																booking={
																	booking
																}
																useIconButton
															/>

															{booking.status !==
																"finished" &&
																booking.status !==
																	"cancelled" && (
																	<>
																		<Button
																			size="sm"
																			variant="ghost"
																			onClick={() =>
																				cancelBooking(
																					booking.id
																				)
																			}
																			className="text-slate-600 hover:text-red-600 hover:bg-red-50 h-8">
																			<X className="h-4 w-4 mr-1" />
																			Cancel
																		</Button>
																		<Button
																			size="sm"
																			onClick={() =>
																				markAsFinished(
																					booking.id
																				)
																			}
																			className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 ml-auto">
																			<Check className="h-4 w-4 mr-1" />
																			Complete
																		</Button>
																	</>
																)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// Loading state component based on view mode
function LoadingState({ viewMode }: { viewMode: string }) {
	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<Card
						key={index}
						className="overflow-hidden border-slate-200 shadow-sm">
						<CardContent className="p-4">
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-5 w-20 rounded-full" />
								</div>
								<Skeleton className="h-5 w-full" />
								<div className="flex items-center">
									<Skeleton className="h-8 w-8 mr-2 rounded-full" />
									<div className="space-y-1 flex-1">
										<Skeleton className="h-4 w-28" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-4 rounded-full" />
									<Skeleton className="h-4 flex-1" />
								</div>
							</div>
						</CardContent>
						<CardFooter className="p-4 pt-0 flex justify-between">
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-24" />
						</CardFooter>
					</Card>
				))}
			</div>
		);
	}

	if (viewMode === "list") {
		return (
			<div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
				<div className="p-6 space-y-4">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="flex flex-wrap gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
							<Skeleton className="h-12 w-20" />
							<div className="space-y-1 flex-1">
								<Skeleton className="h-5 w-48" />
								<Skeleton className="h-4 w-32" />
							</div>
							<Skeleton className="h-8 w-24 rounded-full" />
							<Skeleton className="h-9 w-24" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
			<div className="space-y-8">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className="flex gap-4">
						<Skeleton className="h-5 w-16" />
						<div className="flex-1">
							<div className="ml-4 h-24 rounded-lg border border-slate-200 p-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<Skeleton className="h-5 w-1/3" />
										<Skeleton className="h-5 w-16 rounded-full" />
									</div>
									<Skeleton className="h-4 w-1/4" />
									<div className="flex justify-end gap-2 pt-2">
										<Skeleton className="h-8 w-24" />
										<Skeleton className="h-8 w-24" />
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Empty state component
function EmptyState({
	date,
	setDate,
}: {
	date: Date;
	setDate: (date: Date) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
			<div className="rounded-full bg-indigo-50 p-3 mb-4">
				<CalendarIcon className="h-6 w-6 text-indigo-600" />
			</div>
			<h3 className="text-lg font-medium text-slate-800">
				No bookings for this day
			</h3>
			<p className="text-slate-500 mt-1 mb-4 max-w-md">
				There are no appointments scheduled for{" "}
				{format(date, "MMMM d, yyyy")}.
			</p>
			<Button
				onClick={() => setDate(new Date())}
				className="bg-indigo-600 text-white hover:bg-indigo-700">
				Check today's bookings
			</Button>
		</div>
	);
}

// Booking card component
function BookingCard({
	booking,
	markAsFinished,
	cancelBooking,
}: {
	booking: any;
	markAsFinished: (id: string) => void;
	cancelBooking: (id: string) => void;
}) {
	return (
		<Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow transition-shadow">
			<CardHeader className="p-4 pb-0 flex justify-between items-start">
				<div>
					<div className="flex items-center text-slate-500 text-sm font-medium">
						<Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
						{booking.time}
						<span className="mx-1.5 text-slate-300">•</span>
						<Clock3 className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
						{booking.duration}
					</div>
					<h3 className="font-medium text-slate-800 mt-1.5">
						{booking.serviceName}
					</h3>
					<div className="text-slate-500 text-sm mt-0.5">
						{booking.price}
					</div>
				</div>
				<Badge
					variant="outline"
					className={cn(
						"capitalize text-xs px-2 py-0.5",
						statusConfig[
							booking.status as keyof typeof statusConfig
						].className
					)}>
					{
						statusConfig[
							booking.status as keyof typeof statusConfig
						].icon
					}
					{booking.status}
				</Badge>
			</CardHeader>

			<CardContent className="p-4">
				<div className="flex items-center mb-3">
					<Avatar className="h-9 w-9 mr-2.5 border border-slate-200">
						{booking.clientAvatar ? (
							<AvatarImage
								src={booking.clientAvatar}
								alt={booking.clientName}
							/>
						) : null}
						<AvatarFallback className="bg-indigo-100 text-indigo-600">
							{booking.clientName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium text-slate-800 line-clamp-1">
							{booking.clientName}
						</div>
						<div className="text-slate-500 text-sm">
							{booking.phoneNumber}
						</div>
					</div>
				</div>

				{booking.notes && (
					<div className="text-sm bg-slate-50 rounded p-2 mb-3 text-slate-600 line-clamp-2">
						<span className="font-medium text-slate-700">
							Notes:
						</span>{" "}
						{booking.notes}
					</div>
				)}
			</CardContent>

			<CardFooter className="p-4 pt-0 flex justify-between">
				<BookingDetailsDialog booking={booking} />

				{booking.status !== "finished" &&
				booking.status !== "cancelled" ? (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => cancelBooking(booking.id)}
							className="text-slate-600 hover:text-red-600 hover:bg-red-50">
							<X className="h-4 w-4 mr-1" />
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={() => markAsFinished(booking.id)}
							className="bg-emerald-600 hover:bg-emerald-700 text-white">
							<Check className="h-4 w-4 mr-1" />
							Complete
						</Button>
					</div>
				) : null}
			</CardFooter>
		</Card>
	);
}

// Booking details dialog component
function BookingDetailsDialog({
	booking,
	useIconButton = false,
}: {
	booking: any;
	useIconButton?: boolean;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{useIconButton ? (
					<Button
						size="sm"
						variant="outline"
						className="text-slate-600 hover:text-indigo-600 h-8">
						<Info className="h-4 w-4" />
					</Button>
				) : (
					<Button
						size="sm"
						variant="outline"
						className="text-indigo-700 border-indigo-200 hover:bg-indigo-50">
						<Info className="h-4 w-4 mr-1" />
						Details
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Appointment Details</DialogTitle>
					<DialogDescription>
						Complete information about this booking
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Client Info */}
					<div className="flex items-center">
						<Avatar className="h-10 w-10 mr-3 border border-slate-200">
							{booking.clientAvatar ? (
								<AvatarImage
									src={booking.clientAvatar}
									alt={booking.clientName}
								/>
							) : null}
							<AvatarFallback className="bg-indigo-100 text-indigo-600">
								{booking.clientName.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium text-slate-800">
								{booking.clientName}
							</div>
							<div className="flex items-center text-slate-500 text-sm">
								<Phone className="h-3.5 w-3.5 mr-1" />
								{booking.phoneNumber}
							</div>
						</div>
					</div>

					<Separator />

					{/* Appointment Details */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<div className="text-sm text-slate-500">Date</div>
							<div className="font-medium">
								{format(new Date(), "MMMM d, yyyy")}
							</div>
						</div>
						<div className="space-y-1">
							<div className="text-sm text-slate-500">Time</div>
							<div className="font-medium">
								{booking.time} ({booking.duration})
							</div>
						</div>
						<div className="space-y-1">
							<div className="text-sm text-slate-500">
								Service
							</div>
							<div className="font-medium">
								{booking.serviceName}
							</div>
						</div>
						<div className="space-y-1">
							<div className="text-sm text-slate-500">Price</div>
							<div className="font-medium">{booking.price}</div>
						</div>
						<div className="space-y-1">
							<div className="text-sm text-slate-500">Status</div>
							<Badge
								variant="outline"
								className={cn(
									"capitalize text-xs",
									statusConfig[
										booking.status as keyof typeof statusConfig
									].className
								)}>
								{
									statusConfig[
										booking.status as keyof typeof statusConfig
									].icon
								}
								{booking.status}
							</Badge>
						</div>
						<div className="space-y-1">
							<div className="text-sm text-slate-500">
								Last Visit
							</div>
							<div className="font-medium">
								{booking.lastVisit}
							</div>
						</div>
					</div>

					<Separator />

					{/* Additional Info */}
					<div className="space-y-3">
						<div className="space-y-1">
							<div className="text-sm text-slate-500">
								Preferred Barber
							</div>
							<div className="font-medium">
								{booking.preferredBarber}
							</div>
						</div>

						<div className="space-y-1">
							<div className="text-sm text-slate-500">
								Location
							</div>
							<div className="flex items-center">
								<MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
								<span className="font-medium">
									{booking.location}
								</span>
							</div>
						</div>

						{booking.notes && (
							<div className="space-y-1">
								<div className="text-sm text-slate-500">
									Notes
								</div>
								<div className="bg-slate-50 rounded p-3 text-slate-700">
									{booking.notes}
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="sm:justify-between">
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="text-slate-600">
							<MessageSquare className="h-4 w-4 mr-1.5" />
							Message Client
						</Button>

						{booking.status !== "finished" &&
							booking.status !== "cancelled" && (
								<Button
									size="sm"
									variant="outline"
									className="text-red-600 border-red-200 hover:bg-red-50">
									<X className="h-4 w-4 mr-1.5" />
									Cancel Booking
								</Button>
							)}
					</div>

					<Button
						size="sm"
						className="bg-indigo-600 hover:bg-indigo-700 text-white">
						Edit Appointment
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
