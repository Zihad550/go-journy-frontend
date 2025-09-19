/**
 * Date formatting utilities for charts and UI components
 */

/**
 * Theme-aware color utilities for charts
 */
export const getChartTextColor = (
  variant: "foreground" | "muted" = "muted",
): string => {
  // Check if dark mode is active
  const isDark = document.documentElement.classList.contains("dark");

  if (variant === "foreground") {
    // Primary text color
    return isDark ? "#ffffff" : "#0f172a"; // White or very dark slate
  }

  // Muted text color
  return isDark ? "#cbd5e1" : "#64748b"; // Light slate or medium slate
};

export const getChartGridColor = (): string => {
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? "#334155" : "#e2e8f0"; // Dark slate or light slate
};

/**
 * Resolves CSS custom properties to actual color values for SVG compatibility
 * @param cssVar - CSS custom property (e.g., 'var(--chart-1)')
 * @returns Resolved hex color value
 */
export const resolveChartColor = (cssVar: string): string => {
  const isDark = document.documentElement.classList.contains("dark");

  // Map of CSS variables to their resolved color values
  const colorMap: Record<string, { light: string; dark: string }> = {
    "hsl(var(--chart-1))": { light: "#3b82f6", dark: "#60a5fa" }, // blue
    "hsl(var(--chart-2))": { light: "#10b981", dark: "#34d399" }, // emerald
    "hsl(var(--chart-3))": { light: "#8b5cf6", dark: "#a78bfa" }, // violet
    "hsl(var(--chart-4))": { light: "#f59e0b", dark: "#fbbf24" }, // amber
    "hsl(var(--chart-5))": { light: "#ef4444", dark: "#f87171" }, // red
    "hsl(var(--destructive))": { light: "#ef4444", dark: "#f87171" }, // red for destructive
  };

  const resolved = colorMap[cssVar];
  return resolved ? (isDark ? resolved.dark : resolved.light) : cssVar;
};

/**
 * Month names for formatting
 */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Formats a year and month into a readable chart label
 * @param year - The year (e.g., 2024)
 * @param month - The month (1-12)
 * @param currentYear - Current year for smart abbreviation (optional)
 * @returns Formatted date string for chart labels
 */
export const formatChartDateLabel = (
  year: number,
  month: number,
  currentYear?: number,
): string => {
  const monthName = MONTH_NAMES[month - 1]; // month is 1-based, array is 0-based
  const current = currentYear || new Date().getFullYear();

  // For recent years (within 2 years), show full year
  // For older years, show abbreviated year
  if (current - year <= 2) {
    return `${monthName} ${year}`;
  } else {
    return `${monthName} '${String(year).slice(-2)}`;
  }
};

/**
 * Formats a year and month for different time periods
 * @param year - The year
 * @param month - The month (1-12)
 * @param period - The time period type
 * @returns Formatted date string appropriate for the period
 */
export const formatPeriodDateLabel = (
  year: number,
  month: number,
  period: "daily" | "weekly" | "monthly" | "yearly",
): string => {
  const monthName = MONTH_NAMES[month - 1];

  switch (period) {
    case "monthly":
      return formatChartDateLabel(year, month);
    case "yearly":
      return String(year);
    case "weekly":
      return `${monthName} ${year}`;
    case "daily":
      return `${monthName} ${year}`;
    default:
      return formatChartDateLabel(year, month);
  }
};

/**
 * Gets the full month name from a month number
 * @param month - Month number (1-12)
 * @returns Full month name
 */
export const getFullMonthName = (month: number): string => {
  return FULL_MONTH_NAMES[month - 1];
};

/**
 * Gets the abbreviated month name from a month number
 * @param month - Month number (1-12)
 * @returns Abbreviated month name
 */
export const getMonthName = (month: number): string => {
  return MONTH_NAMES[month - 1];
};

