import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "../tooltip/CustomTooltip";
import { IEarningsChartData } from "@/types/DashboardListingTypes";

const EarningsChart = ({
  earningsTimeRange,
  setEarningsTimeRange,
  weeklyChartData,
  monthlyChartData,
}: {
  earningsTimeRange: "7d" | "30d";
  setEarningsTimeRange: (value: "7d" | "30d") => void;
  weeklyChartData: IEarningsChartData[];
  monthlyChartData: IEarningsChartData[];
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Earnings Over Time</CardTitle>
        <Tabs
          defaultValue="7d"
          value={earningsTimeRange}
          onValueChange={(value) => setEarningsTimeRange(value as "7d" | "30d")}
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
          <BarChart
            data={
              earningsTimeRange === "7d" ? weeklyChartData : monthlyChartData
            }
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#F9B208" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
