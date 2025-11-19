import { create } from 'zustand';
import type { PriceData } from '../types/market.types';

interface PriceState {
  prices: Record<string, PriceData>;
  lastUpdate: Date;
  isUpdating: boolean;
  updateInterval: number | null;
}

interface PriceActions {
  updatePrices: (updates: Record<string, Partial<PriceData>>) => void;
  getPrice: (symbol: string) => number | undefined;
  startPriceUpdates: () => void;
  stopPriceUpdates: () => void;
  setPrices: (prices: Record<string, PriceData>) => void;
  simulatePriceChange: (symbol: string) => void;
}

type PriceStore = PriceState & PriceActions;

/**
 * Simulates realistic price movement
 * Returns a price change percentage between -2% and +2%
 */
const generatePriceChange = (): number => {
  // Generate a random walk with slight upward bias
  const change = (Math.random() - 0.48) * 0.04; // -2% to +2% with slight upward bias
  return change;
};

export const usePriceStore = create<PriceStore>((set, get) => ({
  prices: {},
  lastUpdate: new Date(),
  isUpdating: false,
  updateInterval: null,

  /**
   * Updates prices with new data
   * Merges partial updates with existing price data
   */
  updatePrices: (updates: Record<string, Partial<PriceData>>) => {
    set((state) => {
      const newPrices = { ...state.prices };

      Object.entries(updates).forEach(([symbol, update]) => {
        const existing = state.prices[symbol];
        if (existing) {
          newPrices[symbol] = {
            ...existing,
            ...update,
            timestamp: new Date(),
          };
        } else if (update.price) {
          // Create new price entry if it doesn't exist
          newPrices[symbol] = {
            symbol,
            price: update.price,
            change: update.change || 0,
            changePercent: update.changePercent || 0,
            high: update.high || update.price,
            low: update.low || update.price,
            open: update.open || update.price,
            previousClose: update.previousClose || update.price,
            volume: update.volume || 0,
            timestamp: new Date(),
          };
        }
      });

      return {
        prices: newPrices,
        lastUpdate: new Date(),
      };
    });
  },

  /**
   * Sets the entire prices object (replaces existing)
   */
  setPrices: (prices: Record<string, PriceData>) => {
    set({
      prices,
      lastUpdate: new Date(),
    });
  },

  /**
   * Gets the current price for a symbol
   */
  getPrice: (symbol: string) => {
    const priceData = get().prices[symbol];
    return priceData?.price;
  },

  /**
   * Simulates a price change for a specific symbol
   * Used for realistic market simulation
   */
  simulatePriceChange: (symbol: string) => {
    const state = get();
    const priceData = state.prices[symbol];

    if (!priceData) return;

    const changePercent = generatePriceChange();
    const priceChange = priceData.price * changePercent;
    const newPrice = Math.max(0.01, priceData.price + priceChange); // Ensure price never goes below $0.01

    const change = newPrice - priceData.previousClose;
    const changePercentFromClose = (change / priceData.previousClose) * 100;

    const update: Partial<PriceData> = {
      price: newPrice,
      change,
      changePercent: changePercentFromClose,
      high: Math.max(priceData.high, newPrice),
      low: Math.min(priceData.low, newPrice),
      volume: priceData.volume + Math.floor(Math.random() * 10000),
    };

    get().updatePrices({ [symbol]: update });
  },

  /**
   * Starts automatic price updates
   * Simulates price changes every 2 seconds
   */
  startPriceUpdates: () => {
    const state = get();
    if (state.isUpdating) return;

    set({ isUpdating: true });

    const interval = window.setInterval(() => {
      const currentState = get();
      const symbols = Object.keys(currentState.prices);

      // Update each symbol with a small random price change
      symbols.forEach((symbol) => {
        currentState.simulatePriceChange(symbol);
      });
    }, 2000); // Update every 2 seconds

    set({ updateInterval: interval });
  },

  /**
   * Stops automatic price updates
   */
  stopPriceUpdates: () => {
    const state = get();
    if (state.updateInterval) {
      clearInterval(state.updateInterval);
      set({
        isUpdating: false,
        updateInterval: null,
      });
    }
  },
}));
