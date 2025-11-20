import type { Trade } from './trading.types';

export interface Position {
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
}

export interface Portfolio {
  id: string;
  cash: number;
  positions: Position[];
  transactions: Trade[];
  startingCash: number;
  createdAt: Date;
}
