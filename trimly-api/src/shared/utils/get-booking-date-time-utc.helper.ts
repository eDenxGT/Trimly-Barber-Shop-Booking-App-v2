import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { format, parse } from "date-fns";

export function getBookingDateTimeUTC(
  date: Date | string,
  startTime: string,
  timeZone = "Asia/Kolkata"
): Date {
  const localDateString = formatInTimeZone(
    new Date(date),
    timeZone,
    "yyyy-MM-dd"
  );
  const fullDateTimeString = `${localDateString} ${startTime}`;

  const parsedLocal = parse(
    fullDateTimeString,
    "yyyy-MM-dd hh:mm a",
    new Date()
  );
  const bookingDateTimeUTC = fromZonedTime(parsedLocal, timeZone);

//   console.log("Input Date:", date, "Start Time:", startTime);
//   console.log("Final UTC booking datetime:", bookingDateTimeUTC);
//   console.log("Formatted:", format(bookingDateTimeUTC, "yyyy-MM-dd hh:mm a"));

  return bookingDateTimeUTC;
}
