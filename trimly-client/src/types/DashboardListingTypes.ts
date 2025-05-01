export interface IBookingsChartData {
  date: string;
  count: number;
}
export interface IEarningsChartData {
  date: string;
  total: number;
}

export interface AppointmentData {
  bookingId: string;
  clientName: string;
  clientAvatar?: string;
  timeSlot: string;
  services: string[];
  status: "confirmed" | "cancelled";
}

export interface ReviewData {
  reviewId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface IAnalyticsData {
  totalEarnings: number;
  totalBookings: number;
  totalClientsServed: number;
  upcomingAppointmentsToday: number;
  averageRating: number;
  totalReviews: number;
}

export interface IAdminAnalyticsData {
  totalClients: number;
  totalBarbers: number;
  totalBookings: number;
  totalEarnings: number;
}

export interface ShopDashboardData {
  id: string;
  name: string;
  ownerName: string;
  status: "active" | "pending" | "suspended";
  createdAt: string;
}

export interface ClientDashboardData {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  avatar?: string;
}
