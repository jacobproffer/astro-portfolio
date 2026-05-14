/**
 * Format a date string as a human-readable date.
 * @param {string} dateString - The date string to format.
 * @param {string} locale - The locale to use for formatting (e.g., 'en', 'ja').
 * @returns {string} The formatted date string.
 */
export const formatDate = (
  dateString: string | null | undefined,
  locale: string = "en",
): string | null => {
  if (!dateString) return null;

  const [year, month] = dateString.split("-");
  if (!year || !month) return null; // Validate inputs

  // Map Astro locale codes to Intl locale codes
  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
  };
  const intlLocale = localeMap[locale] || "en-US";

  const date = new Date(Number(year), Number(month) - 1); // Month is 0-indexed
  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "long",
  }).format(date);
};
