export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload[0].dataKey === "count" ? (
          <p className="text-sm">
            Bookings: <span className="font-medium">{payload[0].value}</span>
          </p>
        ) : (
          <p className="text-sm">
            Earnings: <span className="font-medium">${payload[0].value}</span>
          </p>
        )}
      </div>
    );
  }

  return null;
};
