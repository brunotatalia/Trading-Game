import { create } from 'zustand';
import type { PriceData } from '../types/market.types';
import { PriceSimulator } from '../services/simulation/priceSimulator';

interface PriceState {
  prices: Record<string, PriceData>;
  simulator: PriceSimulator;
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  updatePrices: (updates: Record<string, PriceData>) => void;
  getPrice: (symbol: string) => number;
}

const simulator = new PriceSimulator();

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: {},
  simulator,
  isSimulating: false,

  startSimulation: () => {
    const { isSimulating } = get();
    if (isSimulating) return;

    simulator.start((updates) => {
      set({ prices: { ...get().prices, ...updates } });
    });

    set({ isSimulating: true });
  },

  stopSimulation: () => {
    simulator.stop();
    set({ isSimulating: false });
  },

  updatePrices: (updates) => {
    set({ prices: { ...get().prices, ...updates } });
  },

  getPrice: (symbol) => {
    return get().prices[symbol]?.price || simulator.getCurrentPrice(symbol);
  }
}));
