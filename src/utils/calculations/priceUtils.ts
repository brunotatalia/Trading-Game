/**
 * חישוב שינוי במחיר
 */
export function calculateChange(current: number, previous: number): number {
  return current - previous;
}

/**
 * חישוב שינוי באחוזים
 */
export function calculateChangePercent(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * פורמט מחיר
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * פורמט שינוי במחיר
 */
export function formatPriceChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}$${change.toFixed(2)}`;
}

/**
 * פורמט שינוי באחוזים
 */
export function formatPercentChange(changePercent: number): string {
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}

/**
 * בדיקה אם המחיר עלה
 */
export function isPriceUp(current: number, previous: number): boolean {
  return current > previous;
}

/**
 * בדיקה אם המחיר ירד
 */
export function isPriceDown(current: number, previous: number): boolean {
  return current < previous;
}

/**
 * חישוב ממוצע נע פשוט (SMA - Simple Moving Average)
 */
export function calculateSMA(prices: number[], period: number): number[] {
  if (prices.length < period) return [];

  const sma: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }

  return sma;
}

/**
 * חישוב תנודתיות (volatility) היסטורית
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  // חישוב תשואות לוגריתמיות
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }

  // חישוב סטיית תקן
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    (returns.length - 1);

  return Math.sqrt(variance);
}

/**
 * חישוב מקסימום (High)
 */
export function calculateHigh(prices: number[]): number {
  return Math.max(...prices);
}

/**
 * חישוב מינימום (Low)
 */
export function calculateLow(prices: number[]): number {
  return Math.min(...prices);
}

/**
 * חישוב טווח (Range)
 */
export function calculateRange(prices: number[]): number {
  return calculateHigh(prices) - calculateLow(prices);
}

/**
 * פורמט מספר גדול (לmarket cap)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  } else if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
}

/**
 * פורמט נפח מסחר
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  } else if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  } else if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  } else {
    return volume.toString();
  }
}
