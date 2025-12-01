// Dashboard utility functions for formatting and calculations

/**
 * Format a number as currency (USD)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as percentage
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 1)
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format token balance with symbol
 * @param balance - The token balance
 * @param symbol - Token symbol
 * @param decimals - Number of decimal places (default: 4)
 */
export const formatTokenBalance = (
  balance: number,
  symbol: string,
  decimals: number = 4
): string => {
  return `$${balance.toFixed(decimals)} ${symbol}`;
};

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param value - The number to format
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return formatCurrency(value);
};

/**
 * Calculate percentage of a value relative to total
 * @param value - The part value
 * @param total - The total value
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Get color class based on performance (positive/negative)
 * @param isPositive - Whether the performance is positive
 */
export const getPerformanceColor = (isPositive: boolean): string => {
  return isPositive ? "text-green-400" : "text-red-400";
};

/**
 * Get background color class based on performance
 * @param isPositive - Whether the performance is positive
 */
export const getPerformanceBgColor = (isPositive: boolean): string => {
  return isPositive
    ? "border-green-500/30 bg-green-500/10"
    : "border-red-500/30 bg-red-500/10";
};

/**
 * Generate gradient stops for pie chart based on asset allocations
 * @param allocations - Array of asset allocations with percentages and colors
 */
export const generatePieChartGradient = (
  allocations: { percentage: number; color: string }[]
): string => {
  let currentAngle = 0;
  const stops: string[] = [];

  allocations.forEach((allocation) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (allocation.percentage / 100) * 360;
    stops.push(
      `${allocation.color} ${startAngle}deg ${endAngle}deg`
    );
    currentAngle = endAngle;
  });

  return `conic-gradient(${stops.join(", ")})`;
};

/**
 * Get initials from a name (e.g., "Big Cap" -> "BI")
 * @param name - The full name
 */
export const getInitials = (name: string): string => {
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
