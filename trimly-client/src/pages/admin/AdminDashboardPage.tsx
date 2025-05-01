import { AdminDashboard } from "@/components/admin/AdminDasboard";
import { useGetAdminDashboardData } from "@/hooks/admin/useGetAdminDashboard";
import { IAdminAnalyticsData } from "@/types/DashboardListingTypes";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";

export const AdminDashBoardPage = () => {
  const [bookingsTimeRange, setBookingsTimeRange] = useState<"7d" | "30d">(
    "7d"
  );
  const [earningsTimeRange, setEarningsTimeRange] = useState<"7d" | "30d">(
    "7d"
  );

  const { data, isFetching, isError } = useGetAdminDashboardData();
console.log(data)
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={"admin-dash"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <AdminDashboard
            analytics={data?.analytics || ({} as IAdminAnalyticsData)}
            bookingsTimeRange={bookingsTimeRange}
            setBookingsTimeRange={setBookingsTimeRange}
            earningsTimeRange={earningsTimeRange}
            setEarningsTimeRange={setEarningsTimeRange}
            weeklyBookingsChartData={data?.charts.weeklyBookings || []}
            monthlyBookingsChartData={data?.charts.monthlyBookings || []}
            weeklyEarningsChartData={data?.charts.weeklyEarnings || []}
            monthlyEarningsChartData={data?.charts.monthlyEarnings || []}
            shops={data?.recentShops || []}
            clients={data?.recentClients || []}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
