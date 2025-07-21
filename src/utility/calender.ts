export function formatTimestampToDate(timestampInSeconds: number): string {
  const date = new Date(timestampInSeconds * 1000); // Convert to milliseconds

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export  function formatTimestampToTime(timestampInSeconds: number): string {
    const date = new Date(timestampInSeconds * 1000); // Convert to milliseconds

    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two-digit format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two-digit format

    return `${hours}:${minutes}`;
}