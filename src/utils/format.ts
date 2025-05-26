/**
 * @file src/utils/format.ts
 * @description Provides utility functions for formatting data, such as numbers, dates, and strings.
 */

/**
 * @interface NumberFormatOptions
 * @description Defines the options for formatting numbers using `formatNumber`.
 */
interface NumberFormatOptions extends Intl.NumberFormatOptions {}

/**
 * @interface DateTimeFormatOptions
 * @description Defines the options for formatting dates using `formatDate`.
 */
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {}

/**
 * @function formatNumber
 * @description Formats a number with locale-specific settings.
 * @param number The number to format.
 * @param options Optional formatting settings.
 * @returns The formatted number as a string, or the original number if formatting fails.
 */
const formatNumber = (number: number, options?: NumberFormatOptions): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, options);
    return formatter.format(number);
  } catch (error) {
    console.error('src/utils/format.ts: Error formatting number:', error);
    return String(number);
  }
};

/**
 * @function formatDate
 * @description Formats a date with locale-specific settings.
 * @param date The date (or timestamp) to format.
 * @param options Optional formatting settings.
 * @returns The formatted date as a string, or a default string if formatting fails.
 */
const formatDate = (date: Date | number, options?: DateTimeFormatOptions): string => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, options);
    const dateObj = typeof date === 'number' ? new Date(date) : date;
    return formatter.format(dateObj);
  } catch (error) {
    console.error('src/utils/format.ts: Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * @function truncateString
 * @description Truncates a string to a specified maximum length, adding an indicator if truncated.
 * @param text The string to truncate.
 * @param maxLength The maximum length of the truncated string.
 * @param indicator Optional indicator to add at the end of the truncated string (e.g., ellipsis).
 * @returns The truncated string.
 */
const truncateString = (text: string, maxLength: number, indicator: string = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + indicator;
  }

  return truncated + indicator;
};

/**
 * @function escapeHTML
 * @description Escapes HTML entities in a string to prevent XSS vulnerabilities.
 * @param str The string to escape.
 * @returns The escaped string.
 */
const escapeHTML = (str: string): string => {
  let escaped = str.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
  return escaped;
};

/**
 * @function capitalizeFirstLetter
 * @description Capitalizes the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { formatNumber, formatDate, truncateString, escapeHTML, capitalizeFirstLetter };