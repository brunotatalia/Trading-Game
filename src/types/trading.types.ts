/**
 * Trading types and interfaces
 */

export const OrderSide = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export type OrderSide = typeof OrderSide[keyof typeof OrderSide];

export const OrderType = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STOP: 'STOP',
  STOP_LIMIT: 'STOP_LIMIT',
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];

export const OrderStatus = {
  PENDING: 'PENDING',
  FILLED: 'FILLED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  price?: number; // Optional for market orders
  stopPrice?: number; // For stop orders
  filledQuantity: number;
  averagePrice: number;
  timestamp: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  commission: number;
  timestamp: Date;
  totalValue: number;
}

export interface TradeHistory {
  trades: Trade[];
  totalTrades: number;
  totalProfit: number;
  totalLoss: number;
  winRate: number;
}

export interface TradeInput {
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  type?: OrderType;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL';
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  balance: number;
  timestamp: Date;
  description: string;
}
