import { RRule } from "rrule";
import { addMinutes, format, parse, startOfDay } from "date-fns";
import {
	OpeningHours,
	TimeSlot,
} from "@/pages/client/booking/ClientBookingPage";

export function generateSlots(
	openingHours: OpeningHours,
	slotDuration: number = 30
): Record<string, TimeSlot[]> {
	const result: Record<string, TimeSlot[]> = {};
	const rrule = new RRule({
		freq: RRule.DAILY,
		count: 7,
		dtstart: startOfDay(new Date()),
	});

	const dates = rrule.all();

	dates.forEach((date) => {
		const dayKey = date
			.toLocaleDateString("en-US", { weekday: "long" })
			.toLowerCase();
		const dayOpening = openingHours?.[dayKey];

		if (!dayOpening || !dayOpening.open || !dayOpening.close) {
			result[date.toDateString()] = [];
			return;
		}

		const openTime = parse(dayOpening.open, "HH:mm", date);
		const closeTime = parse(dayOpening.close, "HH:mm", date);
		const slots: TimeSlot[] = [];

		let currentSlotTime = openTime;

		while (addMinutes(currentSlotTime, slotDuration) <= closeTime) {
			const timeString = format(currentSlotTime, "h:mm a");
			slots.push({ time: timeString, available: true });
			currentSlotTime = addMinutes(currentSlotTime, slotDuration);
		}

		result[date.toDateString()] = slots;
	});

	return result;
}