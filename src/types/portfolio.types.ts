/**
 * Portfolio and position types
 */

export interface Asset {
  symbol: string;
  name: string;
  type: 'STOCK' | 'CRYPTO' | 'FOREX' | 'COMMODITY';
  currentPrice: number;
  lastUpdated: Date;
}

export interface Position {
  id: string;
  symbol: string;
  asset: Asset;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openedAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  cash: number;
  totalValue: number;
  positions: Position[];
  totalEquity: number;
  totalPnL: number;
  totalPnLPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  cash: number;
  investedValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  numberOfPositions: number;
  topGainer?: Position;
  topLoser?: Position;
}

export interface PortfolioPerformance {
  date: Date;
  value: number;
  dailyReturn: number;
  cumulativeReturn: number;
}
