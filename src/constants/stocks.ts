import type { Stock } from '../types';

export interface StockConfig {
  symbol: string;
  name: string;
  sector: string;
  initialPrice: number;
  baseDrift: number; // mu - annual expected return
  baseVolatility: number; // sigma - annual volatility
}

/**
 * תצורות מניות עם פרמטרים ריאליסטיים
 * Drift: בין -0.2 ל-0.3 (תשואה שנתית צפויה)
 * Volatility: בין 0.15 ל-0.45 (תנודתיות שנתית)
 */
export const STOCK_CONFIGS: StockConfig[] = [
  // Technology - High Growth, High Volatility
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    initialPrice: 178.45,
    baseDrift: 0.25,
    baseVolatility: 0.28,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    initialPrice: 405.63,
    baseDrift: 0.22,
    baseVolatility: 0.26,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    initialPrice: 142.87,
    baseDrift: 0.20,
    baseVolatility: 0.30,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    initialPrice: 495.78,
    baseDrift: 0.30,
    baseVolatility: 0.45,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    initialPrice: 389.45,
    baseDrift: 0.18,
    baseVolatility: 0.35,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    initialPrice: 142.34,
    baseDrift: 0.28,
    baseVolatility: 0.42,
  },

  // E-commerce & Retail
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'E-commerce',
    initialPrice: 165.23,
    baseDrift: 0.23,
    baseVolatility: 0.32,
  },
  {
    symbol: 'SHOP',
    name: 'Shopify Inc.',
    sector: 'E-commerce',
    initialPrice: 78.90,
    baseDrift: 0.15,
    baseVolatility: 0.40,
  },

  // Automotive & EV
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    initialPrice: 234.56,
    baseDrift: 0.20,
    baseVolatility: 0.55,
  },
  {
    symbol: 'F',
    name: 'Ford Motor Company',
    sector: 'Automotive',
    initialPrice: 12.45,
    baseDrift: 0.05,
    baseVolatility: 0.35,
  },

  // Entertainment & Media
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    sector: 'Entertainment',
    initialPrice: 478.90,
    baseDrift: 0.15,
    baseVolatility: 0.38,
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    sector: 'Entertainment',
    initialPrice: 92.67,
    baseDrift: 0.08,
    baseVolatility: 0.25,
  },

  // Finance
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Finance',
    initialPrice: 187.34,
    baseDrift: 0.12,
    baseVolatility: 0.22,
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp.',
    sector: 'Finance',
    initialPrice: 34.56,
    baseDrift: 0.10,
    baseVolatility: 0.25,
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Finance',
    initialPrice: 267.89,
    baseDrift: 0.18,
    baseVolatility: 0.20,
  },

  // Healthcare & Pharma
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    initialPrice: 156.78,
    baseDrift: 0.08,
    baseVolatility: 0.15,
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc.',
    sector: 'Healthcare',
    initialPrice: 28.90,
    baseDrift: 0.05,
    baseVolatility: 0.28,
  },
  {
    symbol: 'MRNA',
    name: 'Moderna Inc.',
    sector: 'Healthcare',
    initialPrice: 89.45,
    baseDrift: 0.10,
    baseVolatility: 0.50,
  },

  // Consumer Goods
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    sector: 'Consumer Goods',
    initialPrice: 59.87,
    baseDrift: 0.06,
    baseVolatility: 0.16,
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo Inc.',
    sector: 'Consumer Goods',
    initialPrice: 172.34,
    baseDrift: 0.07,
    baseVolatility: 0.17,
  },

  // Energy
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    initialPrice: 103.45,
    baseDrift: 0.08,
    baseVolatility: 0.30,
  },
  {
    symbol: 'CVX',
    name: 'Chevron Corporation',
    sector: 'Energy',
    initialPrice: 148.67,
    baseDrift: 0.07,
    baseVolatility: 0.28,
  },

  // Cryptocurrency Related
  {
    symbol: 'COIN',
    name: 'Coinbase Global Inc.',
    sector: 'Crypto',
    initialPrice: 156.78,
    baseDrift: 0.15,
    baseVolatility: 0.65,
  },

  // Social Media
  {
    symbol: 'SNAP',
    name: 'Snap Inc.',
    sector: 'Social Media',
    initialPrice: 12.34,
    baseDrift: 0.05,
    baseVolatility: 0.48,
  },

  // Semiconductors
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    sector: 'Semiconductors',
    initialPrice: 43.56,
    baseDrift: 0.08,
    baseVolatility: 0.32,
  },
];

/**
 * המרת StockConfig ל-Stock עם מחירים ראשוניים
 */
export function initializeStocks(): Stock[] {
  return STOCK_CONFIGS.map((config) => ({
    symbol: config.symbol,
    name: config.name,
    price: config.initialPrice,
    change: 0,
    changePercent: 0,
    volume: Math.floor(Math.random() * 50000000) + 10000000,
    marketCap: config.initialPrice * Math.floor(Math.random() * 10000000000),
  }));
}

/**
 * קבלת תצורה של מניה לפי symbol
 */
export function getStockConfig(symbol: string): StockConfig | undefined {
  return STOCK_CONFIGS.find((config) => config.symbol === symbol);
}

/**
 * סקטורים זמינים
 */
export const SECTORS = [
  'Technology',
  'E-commerce',
  'Automotive',
  'Entertainment',
  'Finance',
  'Healthcare',
  'Consumer Goods',
  'Energy',
  'Crypto',
  'Social Media',
  'Semiconductors',
] as const;

export type Sector = (typeof SECTORS)[number];
