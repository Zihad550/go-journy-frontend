/**
 * Utility functions for formatting numbers into readable metric strings
 */

/**
 * Formats a number into a compact metric string (e.g., 1,000,000 → "1M+")
 * @param num - The number to format
 * @returns Formatted metric string
 */
export const formatMetric = (num: number): string => {
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return `${formatted.replace('.0', '')}M+`;
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return `${formatted.replace('.0', '')}K+`;
  }
  return `${num}+`;
};