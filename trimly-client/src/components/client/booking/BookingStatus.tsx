import { useState } from "react";
import { MapPin, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IBooking } from "./../../../types/Booking";

export function BookingStatus({ bookingData }: { bookingData: IBooking }) {
	const [currentStep, setCurrentStep] = useState("waiting");

	const steps = [
		{ id: "booked", label: "Booked", icon: "📋" },
		{ id: "waiting", label: "Waiting", icon: "⏱️" },
		{ id: "in-process", label: "In-Process", icon: "✂️" },
		{ id: "finished", label: "Finished", icon: "✓" },
	];

	const getProgressPercentage = () => {
		const currentIndex = steps.findIndex((step) => step.id === currentStep);
		return currentIndex >= 0
			? (currentIndex / (steps.length - 1)) * 100
			: 0;
	};

	const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

	return (
		<div className="w-full max-w-5xl mx-auto bg-gray-200 rounded-xl p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Booking Status Section */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-center md:text-left">
						Your Last Booking Status
					</h2>

					{/* Progress Tracker using shadcn Progress */}
					<div className="space-y-4">
						<Progress
							value={getProgressPercentage()}
							className="h-1 bg-gray-300"
							// indicatorClassName="bg-orange-400"
						/>

						<div className="flex justify-between items-center">
							{steps.map((step, index) => (
								<div
									key={step.id}
									className="flex flex-col items-center">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${
							index <= currentStepIndex
								? "bg-blue-600 text-white"
								: "bg-white border border-gray-300"
						}`}>
										<span className="text-xs">
											{step.icon}
										</span>
									</div>
									<span className="text-xs mt-1 font-medium">
										{step.label}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Booking Card */}
					<Card className="bg-white shadow-sm">
						<CardContent className="p-4">
							<div className="flex gap-3">
								<div className="w-16 h-16 rounded-md overflow-hidden">
									<img
										src={bookingData?.shopDetails?.avatar}
										alt="Barbershop"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1">
									<h3 className="font-bold">
										{bookingData?.shopDetails?.shopName}
									</h3>
									<p className="text-sm text-gray-500">
										{
											bookingData?.shopDetails?.location
												?.name
										}
									</p>
									<div className="flex items-center mt-1">
										<span className="text-sm font-medium">
											5.0
										</span>
										<span className="text-sm text-gray-500 ml-1">
											(24)
										</span>
									</div>
								</div>
							</div>

							<div className="flex justify-between mt-4">
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<button className="w-8 h-8 rounded-full bg-green-100 hover:text-green-700 hover:bg-green-200 flex items-center justify-center">
											<MapPin className="h-4 w-4 text-green-600 " />
										</button>
										<span className="text-xs mt-1">
											Navigate
										</span>
									</div>
									<div className="flex flex-col items-center">
										<button className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center">
											<Phone className="h-4 w-4 text-indigo-600" />
										</button>
										<span className="text-xs mt-1">
											Call
										</span>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="bg-indigo-900 text-white hover:bg-indigo-800">
										Cancel
									</Button>
									{/* <Button className="bg-orange-400 text-white hover:bg-orange-500">
										Reschedule
									</Button> */}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Find Salon Section */}
				<div className="space-y-4 max-h-79">
					<h2 className="text-2xl font-bold text-center md:text-left">
						Find Shop In Map
					</h2>
					<div className="h-full rounded-lg overflow-hidden">
						{bookingData?.shopDetails?.location?.coordinates ? (
							<iframe
								width="100%"
								height="100%"
								frameBorder="0"
								style={{ border: 0 }}
								referrerPolicy="no-referrer-when-downgrade"
								allowFullScreen
								loading="lazy"
								src={`https://www.google.com/maps?q=${bookingData?.shopDetails?.location?.coordinates[1]},${bookingData?.shopDetails?.location?.coordinates[0]}&output=embed`}></iframe>
						) : (
							<div className="h-full bg-gray-200 flex items-center justify-center rounded-lg">
								<MapPin className="h-6 w-6 text-gray-400" />
								<span className="ml-2 text-gray-500">
									Map View
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
