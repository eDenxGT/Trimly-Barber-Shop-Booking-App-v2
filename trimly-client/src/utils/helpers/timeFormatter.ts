export const formatTo24Hour = (time12: string): string => {
	if (!time12) return "";

	const [timePart, period] = time12.split(" ");
	const [hours, minutes] = timePart.split(":").map(Number);

	let hours24 = hours;
	if (period === "PM" && hours !== 12) hours24 += 12;
	if (period === "AM" && hours === 12) hours24 = 0;

	return `${hours24.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}`;
};

export const formatTo12Hour = (time24: string): string => {
  if (!time24) return ""
  
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  
  return `${hours12}:${formattedMinutes} ${period}`
}
