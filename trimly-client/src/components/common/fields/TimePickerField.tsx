import * as React from "react";
import { Clock } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatTo12Hour, formatTo24Hour } from "@/utils/helpers/timeFormatter";

interface TimePickerProps {
	value: string;
	onChange: (time: string) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export function TimePicker({
	value,
	onChange,
	label = "Time",
	disabled = false,
	className,
}: TimePickerProps) {
	const time24h = React.useMemo(() => formatTo24Hour(value), [value]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const timeValue = e.target.value;
		const time12h = formatTo12Hour(timeValue);
		onChange(time12h);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground",
						disabled && "opacity-50 cursor-not-allowed",
						className
					)}>
					<Clock className="mr-2 h-4 w-4" />
					{value || "Select time"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto bg-gray-100 p-4">
				<div className="space-y-2">
					<Label htmlFor="time-picker">{label}</Label>
					<Input
						id="time-picker"
						type="time"
						value={time24h}
						onChange={handleTimeChange}
						className="w-full bg-gray-400 text-white font-semibold"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
