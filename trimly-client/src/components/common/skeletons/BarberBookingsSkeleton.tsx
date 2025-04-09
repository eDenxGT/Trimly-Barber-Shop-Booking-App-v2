import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@mui/material";

export function LoadingState({ viewMode }: { viewMode: string }) {
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
