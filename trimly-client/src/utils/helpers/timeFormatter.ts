import moment from "moment";

/**
 * Converts a time string from 24-hour format to 12-hour format
 * @param time24h Time in 24-hour format (HH:MM)
 * @returns Time in 12-hour format with AM/PM (hh:MM AM/PM)
 */
export function formatTo12Hour(time24h: string): string {
  if (!time24h) return "";

  try {
    const [hours, minutes] = time24h
      .split(":")
      .map((part) => parseInt(part, 10));

    if (isNaN(hours) || isNaN(minutes)) return "";

    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch (error) {
    console.error("Error converting time to 12-hour format:", error);
    return "";
  }
}

/**
 * Converts a time string from 12-hour format to 24-hour format
 * @param time12h Time in 12-hour format (hh:MM AM/PM)
 * @returns Time in 24-hour format (HH:MM)
 */
export function formatTo24Hour(time12h: string): string {
  if (!time12h) return "";

  try {
    if (!time12h.includes("AM") && !time12h.includes("PM")) {
      if (time12h.includes(":")) return time12h;
      return "";
    }

    const trimmedTime = time12h.trim();

    const isPM = trimmedTime.toUpperCase().includes("PM");
    const timeWithoutPeriod = trimmedTime.replace(/\s?(AM|PM)\s?/i, "");

    const [hoursStr, minutesStr] = timeWithoutPeriod.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return "";

    if (isPM && hours < 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error converting time to 24-hour format:", error);
    return "";
  }
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSmartDate = (dateStr: string) => {
  const date = moment(dateStr);
  const daysDiff = moment().diff(date, "days");

  return daysDiff < 3 ? date.fromNow() : formatDate(dateStr);
};


export const convertTo24Hour = (hour: string, minute: string, period: string) => {
  let hourNum = Number.parseInt(hour);

  if (period === "PM" && hourNum < 12) {
    hourNum += 12;
  } else if (period === "AM" && hourNum === 12) {
    hourNum = 0;
  }

  return {
    hour: hourNum.toString().padStart(2, "0"),
    minute,
  };
};

export const convertTo12Hour = (hour: string) => {
  const hourNum = Number.parseInt(hour);
  if (hourNum === 0) {
    return { hour: "12", period: "AM" };
  } else if (hourNum === 12) {
    return { hour: "12", period: "PM" };
  } else if (hourNum > 12) {
    return { hour: (hourNum - 12).toString(), period: "PM" };
  } else {
    return { hour: hourNum.toString(), period: "AM" };
  }
};
