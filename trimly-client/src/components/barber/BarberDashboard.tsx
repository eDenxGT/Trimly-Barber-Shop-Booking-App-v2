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

// const weeklyBookingsChartData: IBookingsChartData[] = [
//   { date: "Mon", count: 5 },
//   { date: "Tue", count: 8 },
//   { date: "Wed", count: 10 },
//   { date: "Thu", count: 7 },
//   { date: "Fri", count: 12 },
//   { date: "Sat", count: 15 },
//   { date: "Sun", count: 9 },
// ];

// const monthlyBookingsChartData: IBookingsChartData[] = [
//   { date: "Week 1", count: 35 },
//   { date: "Week 2", count: 42 },
//   { date: "Week 3", count: 38 },
//   { date: "Week 4", count: 41 },
// ];

// const weeklyEarningsChartData: IEarningsChartData[] = [
//   { date: "Mon", total: 100 },
//   { date: "Tue", total: 150 },
//   { date: "Wed", total: 200 },
//   { date: "Thu", total: 120 },
//   { date: "Fri", total: 250 },
//   { date: "Sat", total: 300 },
//   { date: "Sun", total: 180 },
// ];

// const monthlyEarningsChartData: IEarningsChartData[] = [
//   { date: "Week 1", total: 700 },
//   { date: "Week 2", total: 800 },
//   { date: "Week 3", total: 900 },
//   { date: "Week 4", total: 1000 },
// ];

// const appointmentsData: AppointmentData[] = [
//   {
//     id: "1",
//     clientName: "John Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "08:30 am",
//     services: ["Haircut", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "1",
//     clientName: "John Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "08:30 am",
//     services: ["Haircut", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "1",
//     clientName: "John Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "08:30 am",
//     services: ["Haircut", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "1",
//     clientName: "John Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "08:30 am",
//     services: ["Haircut", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "1",
//     clientName: "John Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "08:30 am",
//     services: ["Haircut", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "2",
//     clientName: "Michael Johnson",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "09:00 am",
//     services: ["Hair Color", "Style"],
//     status: "confirmed",
//     serviceName: "Hair coloring",
//   },
//   {
//     id: "3",
//     clientName: "David Brown",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "10:00 am",
//     services: ["Haircut"],
//     status: "cancelled",
//     serviceName: "Basic haircut",
//   },
//   {
//     id: "4",
//     clientName: "Robert Wilson",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "10:30 am",
//     services: ["Full Service", "Beard Trim"],
//     status: "confirmed",
//     serviceName: "Full service",
//   },
//   {
//     id: "5",
//     clientName: "William Lee",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     time: "11:30 am",
//     services: ["Haircut", "Styling"],
//     status: "confirmed",
//     serviceName: "Premium haircut",
//   },
// ];

// const reviewsData: ReviewData[] = [
//   {
//     id: "1",
//     clientName: "James Smith",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     rating: 5,
//     comment: "Great service! Will definitely come back again.",
//     timeAgo: "2h ago",
//   },
//   {
//     id: "2",
//     clientName: "Daniel Johnson",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     rating: 4,
//     comment: "Good haircut, very professional.",
//     timeAgo: "5h ago",
//   },
//   {
//     id: "3",
//     clientName: "Matthew Davis",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     rating: 5,
//     comment: "Excellent fade and great conversation!",
//     timeAgo: "1d ago",
//   },
//   {
//     id: "4",
//     clientName: "Andrew Wilson",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     rating: 4,
//     comment: "Very satisfied with my haircut.",
//     timeAgo: "2d ago",
//   },
//   {
//     reviewId: "5",
//     clientName: "Christopher Taylor",
//     clientAvatar:
//       "https://res.cloudinary.com/dbizg3ugf/image/upload/v1743923562/jdzflyadaegwcjpobsqk.png",
//     rating: 5,
//     comment: "Best barber in town! Always consistent quality.",
//     createdAt: "3d ago",
//   },
// ];

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
