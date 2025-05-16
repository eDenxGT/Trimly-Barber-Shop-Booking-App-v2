export const parse12HourTime = (timeStr: string): { hours: number; minutes: number } => {
    const [time, modifier] = timeStr.split(" ");
    const [rawHours, minutes] = time.split(":").map(Number);
  
    let hours = rawHours; 
  
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  
    return { hours, minutes };
  };