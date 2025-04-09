import MuiButton from "@/components/common/buttons/MuiButton";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function EmptyState({
	date,
	setDate,
}: {
	date: Date;
	setDate: (date: Date) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
			<div className="rounded-full bg-indigo-50 p-3 mb-4">
				<CalendarIcon className="h-6 w-6 text-[var(--yellow)]" />
			</div>
			<h3 className="text-lg font-medium text-slate-800">
				No bookings for this day
			</h3>
			<p className="text-slate-500 mt-1 mb-4 max-w-md">
				There are no appointments scheduled for{" "}
				{format(date, "MMMM d, yyyy")}.
			</p>
			<MuiButton onClick={() => setDate(new Date())}>
				Check today's bookings
			</MuiButton>
		</div>
	);
}
