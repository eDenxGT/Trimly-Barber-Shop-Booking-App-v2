
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AnalyticsCardSkeleton = () => {
  return (
    <Card className="shadow-sm overflow-hidden border-t-4 border-t-gray-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};

export const AppointmentSkeleton = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        <Skeleton className="h-4 w-36 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mb-2" />

            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start mb-4">
                <Skeleton className="w-20 h-4 mt-4 mr-4" />
                <div className={`flex-grow rounded-md p-3 mb-2 ${index % 3 === 0 ? "bg-gray-100" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-full">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReviewsSkeleton = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[320px] overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-6" />
      
      {/* Analytics Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <AnalyticsCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Charts Section Skeletons */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-4" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
      
      {/* Appointments and Reviews Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentSkeleton />
        <ReviewsSkeleton />
      </div>
    </div>
  );
};
