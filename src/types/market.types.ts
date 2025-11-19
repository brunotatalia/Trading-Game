/**
 * Market data types
 */

export const MarketStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PRE_MARKET: 'PRE_MARKET',
  AFTER_HOURS: 'AFTER_HOURS',
} as const;

export type MarketStatus = typeof MarketStatus[keyof typeof MarketStatus];

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  currentPrice: PriceData;
  historicalPrices: HistoricalPrice[];
  status: MarketStatus;
}

export interface HistoricalPrice {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface QuoteData {
  symbol: string;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  spread: number;
  lastPrice: number;
  timestamp: Date;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  addedAt: Date;
}
