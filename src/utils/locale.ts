/**
 * Utility functions for handling localized content
 */

/**
 * Extracts locale from a content entry's id
 * @param id - The id of the content entry (e.g., "ja/project-name" or "en/project-name")
 * @returns The locale code or 'en' as default
 */
export function getLocaleFromId(id: string): string {
  const match = id.match(/^(en|ja)\//);
  return match ? match[1] : "en";
}

/**
 * Filters content collection entries by locale
 * @param entries - Array of content collection entries
 * @param locale - Target locale to filter by
 * @returns Filtered array of entries for the specified locale
 */
export function filterByLocale<T extends { id: string }>(
  entries: T[],
  locale: string,
): T[] {
  return entries.filter((entry) => {
    const entryLocale = getLocaleFromId(entry.id);
    return entryLocale === locale;
  });
}

/**
 * Removes locale prefix from id for cleaner URLs
 * @param id - The id with potential locale prefix
 * @returns Id without locale prefix
 */
export function stripLocaleFromId(id: string): string {
  return id.replace(/^(en|ja)\//, "");
}
