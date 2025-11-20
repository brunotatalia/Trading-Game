import type { StockInfo } from '../types/market.types';

export const STOCKS: StockInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', initialPrice: 175.50 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', initialPrice: 142.30 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', initialPrice: 380.90 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', initialPrice: 155.20 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', initialPrice: 242.80 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', initialPrice: 485.50 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', initialPrice: 495.20 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial', initialPrice: 185.40 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial', initialPrice: 267.30 },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive', initialPrice: 165.80 },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication', initialPrice: 95.60 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication', initialPrice: 485.30 },
  { symbol: 'BA', name: 'The Boeing Company', sector: 'Industrials', initialPrice: 185.70 },
  { symbol: 'NKE', name: 'NIKE Inc.', sector: 'Consumer Cyclical', initialPrice: 108.20 },
  { symbol: 'MCD', name: "McDonald's Corporation", sector: 'Consumer Cyclical', initialPrice: 295.40 },
  { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Defensive', initialPrice: 62.50 },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', initialPrice: 28.90 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', initialPrice: 112.30 },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', initialPrice: 158.70 },
  { symbol: 'GE', name: 'General Electric Company', sector: 'Industrials', initialPrice: 125.80 }
];
