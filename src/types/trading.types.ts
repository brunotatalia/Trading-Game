export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';

export interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  timestamp: Date;
  fee: number;
  total: number;
}

export interface Order {
  symbol: string;
  side: OrderSide;
  quantity: number;
  price?: number;
  type: OrderType;
}

export interface TradeResult {
  success: boolean;
  error?: string;
  trade?: Trade;
}
