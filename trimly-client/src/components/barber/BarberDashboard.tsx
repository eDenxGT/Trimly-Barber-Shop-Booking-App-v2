import {
  AppointmentData,
  IAnalyticsData,
  IBookingsChartData,
  IEarningsChartData,
  ReviewData,
} from "@/types/DashboardListingTypes";
import { AnalyticsCardComponent } from "../common/cards/AnalyticsCard";
import BookingsChart from "../common/charts/BookingsChart";
import EarningsChart from "../common/charts/EarningsChart";
import AppointmentTable from "./dashboard/AppointmentTable";
import LastReviewsTable from "./dashboard/LastReviewsTable";

interface BarberDashboardProps {
  analytics: IAnalyticsData ;
  bookingsTimeRange: "7d" | "30d";
  setBookingsTimeRange: (timeRange: "7d" | "30d") => void;
  earningsTimeRange: "7d" | "30d";
  setEarningsTimeRange: (timeRange: "7d" | "30d") => void;
  weeklyBookingsChartData: IBookingsChartData[];
  monthlyBookingsChartData: IBookingsChartData[];
  weeklyEarningsChartData: IEarningsChartData[];
  monthlyEarningsChartData: IEarningsChartData[];
  appointments: AppointmentData[];
  reviews: ReviewData[];
}

const BarberDashboard = (
  {
    bookingsTimeRange,
    setBookingsTimeRange,
    earningsTimeRange,
    setEarningsTimeRange,
    analytics,
    appointments,
    reviews,
    weeklyBookingsChartData,
    monthlyBookingsChartData,
    weeklyEarningsChartData,
    monthlyEarningsChartData,
  }: BarberDashboardProps 
) =>
  {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Barber Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
            value={`${analytics.totalClientsServed}`}
            icon="users"
            bgColor="bg-green-500/10"
            iconColor="text-green-500"
          />

          <AnalyticsCardComponent
            title="Today's Appointments"
            value={`${analytics.upcomingAppointmentsToday}`}
            icon="calendar"
            bgColor="bg-orange-500/10"
            iconColor="text-orange-500"
          />

          <AnalyticsCardComponent
            title="Average Rating"
            icon="star"
            value={`${analytics.averageRating}`}
            bgColor="bg-yellow-500/10"
            iconColor="text-yellow-500"
            totalReviews={analytics.totalReviews}
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
          <AppointmentTable appointmentsData={appointments} />
          <LastReviewsTable reviewsData={reviews} />
        </div>
      </div>
    );
  };

export default BarberDashboard;
