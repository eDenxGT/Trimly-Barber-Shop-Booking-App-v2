import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
	icon: React.ElementType;
	title: string;
	description: string;
	actionLabel: string;
	onClick: () => void;
	className?: string;
}

export const SettingsCard = ({
	icon: Icon,
	title,
	description,
	actionLabel,
	onClick,
	className,
}: SettingsCardProps) => {
	return (
		<Card
			className={cn(
				"overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors",
				className
			)}>
			<div className="flex items-center p-4">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
					<Icon className="h-4 w-4 text-gray-700" />
				</div>
				<div className="ml-3 flex-1">
					<h3 className="text-sm font-medium">{title}</h3>
					<p className="text-xs text-gray-500">{description}</p>
				</div>
			</div>

			<div className="flex items-center justify-between px-4 ">
				<span className="text-xs font-medium text-gray-600">
					{actionLabel}
				</span>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 w-7 p-0 rounded-full hover:bg-gray-200"
					onClick={onClick}>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">{actionLabel}</span>
				</Button>
			</div>
		</Card>
	);
};
