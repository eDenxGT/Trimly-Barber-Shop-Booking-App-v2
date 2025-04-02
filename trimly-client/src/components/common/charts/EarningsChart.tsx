import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

const data = [
  { name: "1", value: 800, light: 1000 },
  { name: "2", value: 1700, light: 1800 },
  { name: "3", value: 900, light: 1000 },
  { name: "4", value: 1500, light: 1600 },
  { name: "5", value: 1000, light: 1100 },
  { name: "6", value: 1300, light: 1400 },
  { name: "7", value: 800, light: 900 },
  { name: "8", value: 1000, light: 1100 },
  { name: "9", value: 1200, light: 1300 },
  { name: "10", value: 900, light: 1000 },
];

export const EarningsChart = () => {
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Earnings']}
            cursor={{ fill: 'transparent' }}
          />
          <Bar 
            dataKey="light" 
            fill="#E5F7E8" 
            radius={[5, 5, 0, 0]} 
          />
          <Bar 
            dataKey="value" 
            fill="#22C55E" 
            radius={[5, 5, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};