export function generateCompleteWeeklyData(data: any[], isEarnings = false): any[] {
  const weeklyData = [
    { date: "Week 1", [isEarnings ? "total" : "count"]: 0 },
    { date: "Week 2", [isEarnings ? "total" : "count"]: 0 },
    { date: "Week 3", [isEarnings ? "total" : "count"]: 0 },
    { date: "Week 4", [isEarnings ? "total" : "count"]: 0 },
  ];

  data.forEach((item) => {
    const date = new Date(item._id);
    const day = date.getDate();

    let weekIndex = 0;
    if (day <= 7) {
      weekIndex = 0;
    } else if (day <= 14) {
      weekIndex = 1;
    } else if (day <= 21) {
      weekIndex = 2;
    } else {
      weekIndex = 3;
    }

    if (isEarnings) {
      weeklyData[weekIndex].total += item.total;
    } else {
      weeklyData[weekIndex].count += item.count;
    }
  });

  return weeklyData;
}
