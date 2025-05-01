import {
  ClientDashboardData,
  IAdminAnalyticsData,
  IBookingsChartData,
  IEarningsChartData,
  ShopDashboardData,
} from "@/types/DashboardListingTypes";
import { AnalyticsCardComponent } from "../common/cards/AnalyticsCard";
import BookingsChart from "../common/charts/BookingsChart";
import EarningsChart from "../common/charts/EarningsChart";
import RecentClients from "./dashboard/RecentClients";
import RecentShops from "./dashboard/RecentShops";

interface AdminDashboardProps {
  analytics: IAdminAnalyticsData;
  bookingsTimeRange: "7d" | "30d";
  setBookingsTimeRange: (timeRange: "7d" | "30d") => void;
  earningsTimeRange: "7d" | "30d";
  setEarningsTimeRange: (timeRange: "7d" | "30d") => void;
  weeklyBookingsChartData: IBookingsChartData[];
  monthlyBookingsChartData: IBookingsChartData[];
  weeklyEarningsChartData: IEarningsChartData[];
  monthlyEarningsChartData: IEarningsChartData[];
  shops: ShopDashboardData[];
  clients: ClientDashboardData[];
}

export const AdminDashboard = ({
  bookingsTimeRange,
  setBookingsTimeRange,
  earningsTimeRange,
  setEarningsTimeRange,
  analytics,
  weeklyBookingsChartData,
  monthlyBookingsChartData,
  weeklyEarningsChartData,
  monthlyEarningsChartData,
  shops,
  clients,
}: AdminDashboardProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnalyticsCardComponent
          title="Total Earnings"
          value={`${analytics.totalEarnings}`}
          icon="dollar-sign"
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />

        <AnalyticsCardComponent
          title="Total Bookings"
          value={`${analytics.totalBookings}`}
          icon="calendar"
          bgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />

        <AnalyticsCardComponent
          title="Total Clients"
          value={`${analytics.totalClients}`}
          icon="users"
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />

        <AnalyticsCardComponent
          title="Today's Barbers"
          value={`${analytics.totalBarbers}`}
          icon="users"
          bgColor="bg-orange-500/10"
          iconColor="text-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Performance Charts</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingsChart
            bookingsTimeRange={bookingsTimeRange}
            setBookingsTimeRange={setBookingsTimeRange}
            weeklyChartData={weeklyBookingsChartData}
            monthlyChartData={monthlyBookingsChartData}
          />
          <EarningsChart
            earningsTimeRange={earningsTimeRange}
            setEarningsTimeRange={setEarningsTimeRange}
            weeklyChartData={weeklyEarningsChartData}
            monthlyChartData={monthlyEarningsChartData}
          />
        </div>
      </div>

      {/* Appointments Table and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentShops shops={shops} />
        <RecentClients clients={clients} />
      </div>
    </div>
  );
};

export default AdminDashboard;
