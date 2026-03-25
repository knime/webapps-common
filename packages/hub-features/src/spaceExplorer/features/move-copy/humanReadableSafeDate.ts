/**
 * Safe in a way that it does not use any chars that can be problematic in URLs or file names
 */
export const humanReadableSafeDate = (date: Date, separator = "_") => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getMinutes());

  return `${year}-${month}-${day}${separator}${hour}-${minute}-${second}`;
};
