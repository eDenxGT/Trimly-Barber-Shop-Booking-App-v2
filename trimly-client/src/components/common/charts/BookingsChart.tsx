import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "../tooltip/CustomTooltip";
import { IBookingsChartData } from "@/types/DashboardListingTypes";

const BookingsChart = ({
  bookingsTimeRange,
  setBookingsTimeRange,
  weeklyChartData,
  monthlyChartData,
}: {
  bookingsTimeRange: "7d" | "30d";
  setBookingsTimeRange: (value: "7d" | "30d") => void;
  weeklyChartData: IBookingsChartData[];
  monthlyChartData: IBookingsChartData[];
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Bookings Over Time</CardTitle>
        <Tabs
          defaultValue="7d"
          value={bookingsTimeRange}
          onValueChange={(value) => setBookingsTimeRange(value as "7d" | "30d")}
          className="w-[150px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              bookingsTimeRange === "7d" ? weeklyChartData : monthlyChartData
            }
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#047857" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#047857" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#047857"
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BookingsChart;
