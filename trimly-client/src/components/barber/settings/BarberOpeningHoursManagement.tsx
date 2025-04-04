import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/common/fields/TimePickerField";
import MuiButton from "@/components/common/buttons/MuiButton";
import { useNavigate } from "react-router-dom";

type TimeValue = string | null;
type DayHours = { open: TimeValue; close: TimeValue };
type BusinessHours = Record<string, DayHours>;

interface OpeningHoursManagerProps {
	initialHours: BusinessHours;
	onSave: (hours: BusinessHours) => void;
	isLoading: boolean;
}

export default function BarberOpeningHoursForm({
	initialHours,
	onSave,
	isLoading,
}: OpeningHoursManagerProps) {
	const [hours, setHours] = useState<BusinessHours>(initialHours);
	const [isDirty, setIsDirty] = useState(false);
	const navigate = useNavigate();
	const daysOfWeek = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday",
	];

	const formatDayName = (day: string) => {
		return day.charAt(0).toUpperCase() + day.slice(1);
	};

	const updateHours = (
		day: string,
		field: "open" | "close",
		value: TimeValue
	) => {
		setHours((prev) => ({
			...prev,
			[day]: {
				...prev[day],
				[field]: value,
			},
		}));
		setIsDirty(true);
	};

	const toggleDay = (day: string, isOpen: boolean) => {
		if (isOpen) {
			setHours((prev) => ({
				...prev,
				[day]: { open: "", close: "" },
			}));
		} else {
			setHours((prev) => ({
				...prev,
				[day]: { open: null, close: null },
			}));
		}
		setIsDirty(true);
	};

	const handleSave = () => {
		onSave(hours);
		setIsDirty(false);
	};

	return (
		<Card className="w-full max-w-3xl mt-16 mx-auto shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate(-1)}
							className="rounded-full hover:bg-yellow-100">
							<ArrowLeft className="h-5 w-5 text-yellow-600" />
						</Button>
						<CardTitle className="text-xl font-semibold">
							Barber Shop Hours
						</CardTitle>
					</div>
					<Calendar className="h-5 w-5 text-yellow-600" />
				</div>
				<CardDescription className="text-base mt-2">
					Set your barber shop's opening and closing hours for each
					day of the week.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{daysOfWeek?.map((day) => {
						const dayData = hours[day] || {
							open: null,
							close: null,
						};
						const isOpen =
							dayData.open !== null && dayData.close !== null;

						return (
							<div
								key={day}
								className={cn(
									"grid grid-cols-[120px_1fr] gap-4 items-center p-3 rounded-lg border border-gray-100",
									isOpen ? "opacity-100" : "opacity-80"
								)}>
								<div className="flex items-center gap-3">
									<Switch
										checked={isOpen}
										onCheckedChange={(checked) =>
											toggleDay(day, checked)
										}
										id={`${day}-toggle`}
										className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
									/>
									<Label
										htmlFor={`${day}-toggle`}
										className="font-medium">
										{formatDayName(day)}
									</Label>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<Label className="text-xs text-gray-500 flex items-center gap-1">
											Opening Time
										</Label>
										<TimePicker
											disabled={!isOpen}
											value={dayData.open || ""}
											onChange={(value) =>
												updateHours(day, "open", value)
											}
											className={cn(
												"transition-all",
												isOpen
													? "border-yellow-300 focus-within:ring-yellow-200"
													: ""
											)}
										/>
									</div>

									<div className="space-y-1">
										<Label className="text-xs text-gray-500 flex items-center gap-1">
											Closing Time
										</Label>
										<TimePicker
											disabled={!isOpen}
											value={dayData.close || ""}
											onChange={(value) =>
												updateHours(day, "close", value)
											}
											className={cn(
												"transition-all",
												isOpen
													? "border-yellow-300 focus-within:ring-yellow-200"
													: ""
											)}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
			<CardFooter className="flex justify-between border-t pt-5 mt-4">
				<div className="text-sm text-gray-500">
					{isDirty
						? "You have unsaved changes"
						: "Hours are up to date"}
				</div>
				<MuiButton
					onClick={handleSave}
					loading={isLoading}
					disabled={!isDirty || isLoading}
					className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6">
					Save
				</MuiButton>
			</CardFooter>
		</Card>
	);
}
