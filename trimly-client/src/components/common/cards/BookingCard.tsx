import { BookingDetailsDialog } from "@/components/modals/BookingDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IBooking } from "@/types/Booking";
import { Check, Clock, Clock3 } from "lucide-react";

export function BookingCard({
	booking,
	markAsFinished,
	messageClient,
	statusConfig,
}: {
	booking: IBooking;
	markAsFinished: (id: string) => void;
	messageClient: (clientName: string) => void;
	statusConfig: any;
}) {
	return (
		<Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow transition-shadow h-[400px] flex flex-col">
			<CardHeader className="p-4 pb-0 flex justify-between items-start">
				<div>
					<div className="flex items-center text-slate-500 text-sm font-medium">
						<Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
						{booking.startTime}
						<span className="mx-1.5 text-slate-300">•</span>
						<Clock3 className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
						{booking.duration} min
					</div>
					<h3 className="font-medium text-slate-800 mt-1.5">
						{booking?.servicesDetails
							?.map((s) => s.name)
							.join(", ")}
					</h3>
					<div className="text-slate-500 text-sm mt-0.5">
						₹{booking.total}
					</div>
				</div>
				<Badge
					variant="outline"
					className={cn(
						"capitalize text-xs px-2 py-0.5",
						statusConfig[booking?.status || "pending"].className
					)}>
					{statusConfig[booking?.status || "pending"].icon}
					{booking.status}
				</Badge>
			</CardHeader>

			<CardContent className="p-4 flex-grow overflow-hidden">
				<div className="flex items-center mb-3">
					<Avatar className="h-9 w-9 mr-2.5 border border-slate-200">
						{booking?.clientDetails?.avatar ? (
							<AvatarImage
								src={booking?.clientDetails?.avatar}
								alt={booking?.clientDetails?.fullName}
							/>
						) : null}
						<AvatarFallback className="bg-indigo-100 text-indigo-600">
							{booking?.clientDetails?.fullName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium text-slate-800 line-clamp-1">
							{booking?.clientDetails?.fullName}
						</div>
						<div className="text-slate-500 text-sm">
							{booking?.clientDetails?.phoneNumber}
						</div>
					</div>
				</div>

				<div className="bg-slate-50 rounded p-2 mb-3 text-slate-600 h-[150px] flex flex-col">
					<span className="font-medium text-slate-700 mb-1">
						Services:
					</span>
					<ScrollArea className="flex-grow rounded">
						<div className="text-sm pr-3">
							{booking?.servicesDetails?.map((service, idx) => (
								<div key={idx} className="flex justify-between mt-1 py-1">
									<span>{service.name}</span>
									<span className="font-medium ml-2">
										₹{service.price}
									</span>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0 flex justify-between mt-auto">
				<BookingDetailsDialog
					statusConfig={statusConfig}
					booking={booking}
					messageClient={messageClient}
				/>

				{booking.status !== "completed" &&
					booking.status !== "cancelled" && (
						<Button
							size="sm"
							onClick={() =>
								markAsFinished(booking.bookingId || "")
							}
							className="bg-emerald-600 hover:bg-emerald-700 text-white">
							<Check className="h-4 w-4 mr-1" />
							Complete
						</Button>
					)}
			</CardFooter>
		</Card>
	);
}
