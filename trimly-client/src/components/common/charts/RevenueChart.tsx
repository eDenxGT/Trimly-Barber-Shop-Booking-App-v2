import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { name: "Jan", value: 1000 },
  { name: "Feb", value: 1500 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 1700 },
  { name: "May", value: 1900 },
  { name: "Jun", value: 2200 },
  { name: "Jul", value: 1800 },
  { name: "Aug", value: 2000 },
  { name: "Sep", value: 2500 },
  { name: "Oct", value: 2300 },
  { name: "Nov", value: 1800 },
  { name: "Dec", value: 2100 },
];

export const RevenueChart = () => {
  return (
    <div className="w-full h-60 bg-blue-50 rounded-lg">
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
              cursor={{ stroke: '#EEF2FF' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white p-2 rounded shadow-lg">
                      <p className="text-sm">${payload[0].value}</p>
                      <p className="text-xs opacity-70">Oct 23</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x="Jun" stroke="#888" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute left-1/2 top-8 bg-gray-900 text-white px-3 py-1 rounded shadow-lg transform -translate-x-1/2">
          <p className="text-sm font-medium">$7,645</p>
          <p className="text-xs opacity-70">Oct 23</p>
        </div>
      </div>
    </div>
  );
};
