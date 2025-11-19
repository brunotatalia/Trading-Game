// Stock Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

// Portfolio Types
export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  fee: number;
  timestamp: Date;
}

export interface Portfolio {
  cash: number;
  positions: Position[];
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  transactions: Transaction[];
}

// Order Types
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL';

export interface Order {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number; // For limit orders
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
