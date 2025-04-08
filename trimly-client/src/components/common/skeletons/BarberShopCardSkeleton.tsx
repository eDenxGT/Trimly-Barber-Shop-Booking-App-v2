import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const BarberShopCardSkeleton = () => (
	<Card className="w-full max-w-md overflow-hidden border-0 rounded-none shadow-lg">
		<div className="relative h-64 w-full overflow-hidden">
			{/* Banner skeleton */}
			<Skeleton className="h-full w-full" />

			{/* Action buttons skeleton */}
			<div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-28" />
			</div>
		</div>

		<CardContent className="p-5">
			<div className="flex items-start gap-4">
				{/* Avatar skeleton */}
				<Skeleton className="h-12 w-12 rounded-full" />

				<div className="flex-1">
					<div className="flex items-center justify-between">
						{/* Shop name skeleton */}
						<Skeleton className="h-8 w-40" />
						{/* Open/closed badge skeleton */}
						<Skeleton className="h-6 w-24" />
					</div>

					{/* Description skeleton */}
					<Skeleton className="h-4 w-full mt-2" />
					<Skeleton className="h-4 w-4/5 mt-2" />
				</div>
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-4">
				{/* Location skeleton */}
				<Skeleton className="h-5 w-32" />
				{/* Rating skeleton */}
				<Skeleton className="h-5 w-16" />
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{/* Amenities badges skeleton */}
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-6 w-24" />
			</div>
		</CardContent>
	</Card>
);
