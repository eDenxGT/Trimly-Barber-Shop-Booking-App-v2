import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Sample booking history data
const bookings = [
	{
		id: 1,
		shopName: "Master piece Barbershop",
		location: "Sega Expo Centre (2 mi)",
		services: ["Haircut", "Beard Trim"],
		date: "Apr 15, 2025",
		time: "10:30 AM",
		status: "Confirmed",
		price: 45.0,
		rating: 5.0,
		reviews: 24,
		image: "/placeholder.svg?height=64&width=64",
	},
	{
		id: 2,
		shopName: "Elite Cuts & Styles",
		location: "Downtown Mall (1.5 mi)",
		services: ["Haircut", "Hair Wash", "Styling"],
		date: "Mar 28, 2025",
		time: "2:15 PM",
		status: "Completed",
		price: 65.0,
		rating: 4.8,
		reviews: 36,
		image: "/placeholder.svg?height=64&width=64",
	},
	{
		id: 3,
		shopName: "Urban Grooming Lounge",
		location: "Westside Plaza (3.2 mi)",
		services: ["Beard Trim", "Facial"],
		date: "Mar 10, 2025",
		time: "4:45 PM",
		status: "Cancelled",
		price: 35.0,
		rating: 4.5,
		reviews: 18,
		image: "/placeholder.svg?height=64&width=64",
	},
	{
		id: 4,
		shopName: "Classic Gentleman's Barber",
		location: "North Avenue (0.8 mi)",
		services: ["Haircut", "Hot Towel Shave"],
		date: "Feb 22, 2025",
		time: "11:00 AM",
		status: "Completed",
		price: 55.0,
		rating: 4.9,
		reviews: 42,
		image: "/placeholder.svg?height=64&width=64",
	},
];

export function BookingHistory() {
	const [activeTab, setActiveTab] = useState("all");
	const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Filter bookings based on active tab
	const filteredBookings = bookings.filter((booking) => {
		if (activeTab === "all") return true;
		return booking.status.toLowerCase() === activeTab.toLowerCase();
	});

	// View booking details
	const viewBookingDetails = (bookingId: number) => {
		setSelectedBooking(bookingId);
		setIsDialogOpen(true);
	};

	// Get status badge color
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Get the selected booking
	const getSelectedBooking = () => {
		return bookings.find((booking) => booking.id === selectedBooking);
	};

	return (
		<div className="w-full max-w-6xl mx-auto bg-gray-200 rounded-xl p-6">
			<h2 className="text-2xl font-bold mb-6">Your Booking History</h2>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="mb-6">
				<TabsList className="grid grid-cols-3 w-full max-w-md">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
					<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
				</TabsList>
			</Tabs>

			<Card className="bg-white shadow-sm overflow-hidden">
				<CardContent className="p-0">
					{filteredBookings.length === 0 ? (
						<div className="p-6 text-center text-gray-500">
							No bookings found for this filter.
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Barber Shop</TableHead>
										<TableHead>Services</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Price</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredBookings.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-md overflow-hidden hidden sm:block">
														<img
															src={
																booking.image ||
																"/placeholder.svg"
															}
															alt={
																booking.shopName
															}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<div className="font-medium">
															{booking.shopName}
														</div>
														<div className="text-xs text-gray-500">
															{booking.location}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{booking.services.map(
														(service, index) => (
															<Badge
																key={index}
																variant="outline"
																className="bg-gray-50 text-xs">
																{service}
															</Badge>
														)
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="whitespace-nowrap">
													<div>{booking.date}</div>
													<div className="text-xs text-gray-500">
														{booking.time}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge
													className={getStatusColor(
														booking.status
													)}>
													{booking.status}
												</Badge>
											</TableCell>
											<TableCell className="font-medium">
												${booking.price.toFixed(2)}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="sm"
													className="text-indigo-900 hover:text-indigo-700 hover:bg-indigo-50"
													onClick={() =>
														viewBookingDetails(
															booking.id
														)
													}>
													<Eye className="h-4 w-4 mr-1" />
													Details
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Booking Details Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Booking Details</DialogTitle>
					</DialogHeader>
					{selectedBooking && (
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-16 h-16 rounded-md overflow-hidden">
									<img
										src={
											getSelectedBooking()?.image ||
											"/placeholder.svg"
										}
										alt={getSelectedBooking()?.shopName}
										className="w-full h-full object-cover"
									/>
								</div>
								<div>
									<h3 className="font-bold">
										{getSelectedBooking()?.shopName}
									</h3>
									<p className="text-sm text-gray-500">
										{getSelectedBooking()?.location}
									</p>
									<div className="flex items-center mt-1">
										<span className="text-sm font-medium">
											{getSelectedBooking()?.rating}
										</span>
										<span className="text-sm text-gray-500 ml-1">
											({getSelectedBooking()?.reviews})
										</span>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm">
								<div className="space-y-1">
									<div className="text-gray-500">
										Booking ID
									</div>
									<div className="font-medium">
										#
										{getSelectedBooking()
											?.id.toString()
											.padStart(6, "0")}
									</div>
								</div>
								<div className="space-y-1">
									<div className="text-gray-500">Status</div>
									<Badge
										className={getStatusColor(
											getSelectedBooking()?.status || ""
										)}>
										{getSelectedBooking()?.status}
									</Badge>
								</div>
								<div className="space-y-1">
									<div className="text-gray-500">Date</div>
									<div className="font-medium">
										{getSelectedBooking()?.date}
									</div>
								</div>
								<div className="space-y-1">
									<div className="text-gray-500">Time</div>
									<div className="font-medium">
										{getSelectedBooking()?.time}
									</div>
								</div>
								<div className="space-y-1 col-span-2">
									<div className="text-gray-500">
										Services
									</div>
									<div className="flex flex-wrap gap-1">
										{getSelectedBooking()?.services.map(
											(service, index) => (
												<Badge
													key={index}
													variant="outline"
													className="bg-gray-50">
													{service}
												</Badge>
											)
										)}
									</div>
								</div>
								<div className="space-y-1 col-span-2">
									<div className="text-gray-500">
										Total Amount
									</div>
									<div className="font-bold text-lg">
										$
										{getSelectedBooking()?.price.toFixed(2)}
									</div>
								</div>
							</div>

							{getSelectedBooking()?.status === "Completed" && (
								<Button className="w-full bg-indigo-900 text-white hover:bg-indigo-800">
									Book Again
								</Button>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
