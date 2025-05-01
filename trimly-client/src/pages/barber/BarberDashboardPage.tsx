import BarberDashboard from "@/components/barber/BarberDashboard";
import { DashboardSkeleton } from "@/components/common/skeletons/DashboardSkeleton";
import { useGetBarberDashboardData } from "@/hooks/barber/useBarberDashboard";
import { IAnalyticsData } from "@/types/DashboardListingTypes";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";

export const BarberDashBoardPage = () => {
  const [bookingsTimeRange, setBookingsTimeRange] = useState<"7d" | "30d">(
    "7d"
  );
  const [earningsTimeRange, setEarningsTimeRange] = useState<"7d" | "30d">(
    "7d"
  );

  const { data, isFetching, isError } = useGetBarberDashboardData();

  console.log(data);
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={"barber-dash"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {isFetching && !isError ? (
            <DashboardSkeleton />
          ) : isError ? (
            <>
              <div className="flex items-center h-[100vh] justify-center">
                <span className="text-center text-red-500 font-bold">
                  Failed to load dashboard
                </span>
              </div>
            </>
          ) : (
            <BarberDashboard
              bookingsTimeRange={bookingsTimeRange}
              setBookingsTimeRange={setBookingsTimeRange}
              earningsTimeRange={earningsTimeRange}
              setEarningsTimeRange={setEarningsTimeRange}
              analytics={data?.analytics || ({} as IAnalyticsData)}
              appointments={data?.upcomingAppointments || []}
              reviews={data?.latestReviews || []}
              weeklyBookingsChartData={data?.charts.weeklyBookings || []}
              weeklyEarningsChartData={data?.charts.weeklyEarnings || []}
              monthlyBookingsChartData={data?.charts.monthlyBookings || []}
              monthlyEarningsChartData={data?.charts.monthlyEarnings || []}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
