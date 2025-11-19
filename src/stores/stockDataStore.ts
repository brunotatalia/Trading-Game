import { create } from 'zustand';
import type { Stock } from '../types';

interface StockDataState {
  stocks: Stock[];
  getStock: (symbol: string) => Stock | undefined;
  updatePrices: () => void;
}

// Mock stock data - בפרויקט אמיתי זה יגיע מ-API
const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change: 2.35,
    changePercent: 1.33,
    volume: 52000000,
    marketCap: 2800000000000,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.87,
    change: -1.23,
    changePercent: -0.85,
    volume: 28000000,
    marketCap: 1750000000000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 405.63,
    change: 5.67,
    changePercent: 1.42,
    volume: 31000000,
    marketCap: 3000000000000,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 165.23,
    change: 3.45,
    changePercent: 2.13,
    volume: 45000000,
    marketCap: 1700000000000,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 234.56,
    change: -4.32,
    changePercent: -1.81,
    volume: 98000000,
    marketCap: 750000000000,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 495.78,
    change: 12.34,
    changePercent: 2.55,
    volume: 42000000,
    marketCap: 1220000000000,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 389.45,
    change: 6.78,
    changePercent: 1.77,
    volume: 19000000,
    marketCap: 990000000000,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 142.34,
    change: -2.56,
    changePercent: -1.77,
    volume: 55000000,
    marketCap: 230000000000,
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 478.90,
    change: 8.90,
    changePercent: 1.89,
    volume: 12000000,
    marketCap: 210000000000,
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    price: 92.67,
    change: 1.23,
    changePercent: 1.35,
    volume: 14000000,
    marketCap: 170000000000,
  },
];

export const useStockDataStore = create<StockDataState>((set, get) => ({
  stocks: INITIAL_STOCKS,

  getStock: (symbol: string) => {
    return get().stocks.find((s) => s.symbol === symbol);
  },

  updatePrices: () => {
    // סימולציה של שינויי מחירים - בפרויקט אמיתי זה יגיע מ-API או WebSocket
    set((state) => ({
      stocks: state.stocks.map((stock) => {
        const randomChange = (Math.random() - 0.5) * 2; // -1% to +1%
        const newPrice = stock.price * (1 + randomChange / 100);
        const change = newPrice - stock.price;
        const changePercent = (change / stock.price) * 100;

        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
        };
      }),
    }));
  },
}));
