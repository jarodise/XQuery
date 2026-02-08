/**
 * Formats a timestamp as a relative time string.
 * @param timestamp - Unix timestamp in seconds or milliseconds
 * @returns Relative time string (e.g., "Just now", "5m ago", "2h ago")
 */
export function formatRelativeTime(timestamp: number): string {
  // Handle edge cases
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    return 'Unknown time';
  }

  // Convert to milliseconds if needed (Unix timestamps are often in seconds)
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const now = Date.now();
  const diff = now - ms;

  // Future timestamps
  if (diff < 0) {
    return 'Just now';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Less than 1 minute
  if (seconds < 60) {
    return 'Just now';
  }

  // 1-59 minutes
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  // 1-23 hours
  if (hours < 24) {
    return `${hours}h ago`;
  }

  // 1-6 days
  if (days <= 6) {
    return `${days}d ago`;
  }

  // 7-30 days (weeks)
  if (days <= 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  // Older than 30 days - show absolute date
  return formatAbsoluteDate(ms);
}

/**
 * Formats a timestamp as an absolute date string.
 * @param ms - Timestamp in milliseconds
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
function formatAbsoluteDate(ms: number): string {
  const date = new Date(ms);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return 'Unknown date';
  }

  // Use Intl.DateTimeFormat for consistent formatting
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formatter.format(date);
  } catch {
    // Fallback for environments without full Intl support
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  }
}

/**
 * Formats a timestamp using Intl.RelativeTimeFormat for i18n support.
 * Falls back to English if not supported.
 * @param timestamp - Unix timestamp in seconds or milliseconds
 * @param locale - Optional locale string (e.g., 'en', 'zh', 'ja')
 * @returns Localized relative time string
 */
export function formatRelativeTimeI18n(timestamp: number, locale = 'en'): string {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    return 'Unknown time';
  }

  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const now = Date.now();
  const diff = now - ms;

  if (diff < 0 || diff < 60000) {
    // Return "Just now" in various languages
    const justNowMap: Record<string, string> = {
      en: 'Just now',
      zh: '刚刚',
      ja: 'たった今',
      es: 'Ahora mismo',
    };
    return justNowMap[locale] || justNowMap.en;
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (minutes < 60) {
    value = -minutes;
    unit = 'minute';
  } else if (hours < 24) {
    value = -hours;
    unit = 'hour';
  } else if (days <= 6) {
    value = -days;
    unit = 'day';
  } else if (days <= 30) {
    value = -Math.floor(days / 7);
    unit = 'week';
  } else {
    return formatAbsoluteDate(ms);
  }

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return rtf.format(value, unit);
  } catch {
    // Fallback to English format
    return formatRelativeTime(ms / 1000);
  }
}
