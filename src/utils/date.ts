/**
 * Format a date string as a human-readable date.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  const [year, month] = dateString.split("-");
  if (!year || !month) return null; // Validate inputs

  const date = new Date(Number(year), Number(month) - 1); // Month is 0-indexed
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
};

/**
 * Format a "YYYY-MM" date string as a compact "MM.YYYY" readout.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatShortDate = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  const [year, month] = dateString.split("-");
  if (!year || !month) return null;

  return `${month.padStart(2, "0")}.${year}`;
};
