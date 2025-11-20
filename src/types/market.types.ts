export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

export interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
  initialPrice: number;
}
