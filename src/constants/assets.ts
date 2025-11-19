/**
 * Available trading assets
 * These are the stocks available for trading in the simulation
 */

export interface AssetDefinition {
  symbol: string;
  name: string;
  sector: string;
  initialPrice: number;
}

export const AVAILABLE_ASSETS: AssetDefinition[] = [
  // Technology
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    initialPrice: 178.72,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    initialPrice: 378.91,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    initialPrice: 141.8,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    initialPrice: 338.59,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    initialPrice: 495.22,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    initialPrice: 242.84,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    initialPrice: 122.43,
  },

  // Finance
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Finance',
    initialPrice: 154.32,
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp',
    sector: 'Finance',
    initialPrice: 35.89,
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Finance',
    initialPrice: 267.45,
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    sector: 'Finance',
    initialPrice: 456.78,
  },

  // Healthcare
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    initialPrice: 157.63,
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc.',
    sector: 'Healthcare',
    initialPrice: 28.94,
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    sector: 'Healthcare',
    initialPrice: 512.87,
  },

  // Consumer
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer',
    initialPrice: 178.25,
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer',
    initialPrice: 62.54,
  },
  {
    symbol: 'HD',
    name: 'Home Depot Inc.',
    sector: 'Consumer',
    initialPrice: 367.89,
  },
  {
    symbol: 'NKE',
    name: 'Nike Inc.',
    sector: 'Consumer',
    initialPrice: 101.47,
  },

  // Energy
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corp',
    sector: 'Energy',
    initialPrice: 108.56,
  },
  {
    symbol: 'CVX',
    name: 'Chevron Corporation',
    sector: 'Energy',
    initialPrice: 147.23,
  },
];

/**
 * Get asset definition by symbol
 */
export function getAssetBySymbol(symbol: string): AssetDefinition | undefined {
  return AVAILABLE_ASSETS.find((asset) => asset.symbol === symbol);
}

/**
 * Get assets by sector
 */
export function getAssetsBySector(sector: string): AssetDefinition[] {
  return AVAILABLE_ASSETS.filter((asset) => asset.sector === sector);
}

/**
 * Get all unique sectors
 */
export function getAllSectors(): string[] {
  const sectors = new Set(AVAILABLE_ASSETS.map((asset) => asset.sector));
  return Array.from(sectors).sort();
}

/**
 * Initial prices as a Record for easy lookup
 */
export const INITIAL_PRICES: Record<string, number> = AVAILABLE_ASSETS.reduce(
  (acc, asset) => {
    acc[asset.symbol] = asset.initialPrice;
    return acc;
  },
  {} as Record<string, number>
);
