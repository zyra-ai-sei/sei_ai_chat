export function formatDate(inputDate: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "IST",
  };

  const utcDate = new Date(inputDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    utcDate
  );

  const modifiedDate =
    formattedDate.replace(",", " |") + " " + options?.timeZone;
  return modifiedDate;
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp) {
    return "";
  }

  // Convert timestamp to JavaScript Date object
  const date: Date = new Date(timestamp);

  // Format the adjusted date according to the desired format
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Abbreviated month name (e.g., 'Apr')
    day: "numeric", // Day of the month (e.g., '1')
    hour: "numeric", // Hour in 12-hour format (e.g., '2')
    minute: "2-digit", // Minutes (e.g., '00')
    hour12: true, // Use 12-hour clock (e.g., 'AM' or 'PM')
    timeZoneName: "short", // Abbreviated timezone name (e.g., 'IST')
  };

  return date
    .toLocaleString("en-IN", options)
    ?.replace(",", " |")
    ?.replace("am", "AM")
    ?.replace("pm", "PM");
}

export function formatTimestampClock(timestamp: number): string {
  if (!timestamp) {
    return "";
  }

  // Convert timestamp to JavaScript Date object
  const date: Date = new Date(timestamp);

  // Format the adjusted date according to the desired format
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric", // Hour in 12-hour format (e.g., '2')
    minute: "2-digit", // Minutes (e.g., '00')
    hour12: true, // Use 12-hour clock (e.g., 'AM' or 'PM')
    timeZoneName: "short", // Abbreviated timezone name (e.g., 'IST')
  };

  return date
    .toLocaleString("en-IN", options)
    ?.replace(",", " |")
    ?.replace("am", "AM")
    ?.replace("pm", "PM");
}

export function formatNumber(value: number): string | number {
  if (!value) {
    return 0;
  }

  // Check if the number is an integer
  if (Number.isInteger(value)) {
    return value.toFixed(0); // No decimals for integer
  } else {
    return value.toFixed(2); // Two decimals for non-integer
  }
}

export function formatJoinedDate(
  isoDateString: string,
  includeDay?: boolean
): string {
  if (!isoDateString) {
    return "";
  }
  // Parse the ISO date string into a Date object
  const date = new Date(isoDateString);

  // Get the full month name and the year
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const day = date.getDate();

  return includeDay ? `${day} ${month} ${year}` : `${month} ${year}`;
}

export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if the birth date hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function getClientTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
