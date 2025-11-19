import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Stock } from '../types';
import type { MarketRegime, MarketStatus } from '../services/simulation/marketSimulator';
import { MarketSimulator } from '../services/simulation/marketSimulator';
import { STOCK_CONFIGS, initializeStocks } from '../constants/stocks';
import { calculateChange, calculateChangePercent } from '../utils/calculations/priceUtils';

interface StockDataState {
  stocks: Stock[];
  marketRegime: MarketRegime;
  marketStatus: MarketStatus;
  vix: number;
  isSimulationRunning: boolean;
  priceHistory: Map<string, number[]>;

  // Actions
  getStock: (symbol: string) => Stock | undefined;
  getPriceHistory: (symbol: string, days?: number) => number[];
  startSimulation: () => void;
  stopSimulation: () => void;
  reset: () => void;
}

// יצירת market simulator גלובלי (מחוץ ל-store כדי לשמור על singleton)
const marketSimulator = new MarketSimulator(STOCK_CONFIGS);

export const useStockDataStore = create<StockDataState>()(
  persist(
    (set, get) => ({
      stocks: initializeStocks(),
      marketRegime: 'sideways',
      marketStatus: 'open',
      vix: 15,
      isSimulationRunning: false,
      priceHistory: new Map(),

      getStock: (symbol: string) => {
        return get().stocks.find((s) => s.symbol === symbol);
      },

      getPriceHistory: (symbol: string, days: number = 30) => {
        return marketSimulator.getPriceHistory(symbol, days);
      },

      startSimulation: () => {
        if (get().isSimulationRunning) {
          console.warn('Simulation already running');
          return;
        }

        console.log('Starting market simulation...');

        marketSimulator.start((priceUpdates) => {
          // עדכון המחירים בstore
          set((state) => {
            const updatedStocks = state.stocks.map((stock) => {
              const newPrice = priceUpdates.get(stock.symbol);

              if (newPrice !== undefined) {
                const change = calculateChange(newPrice, stock.price);
                const changePercent = calculateChangePercent(newPrice, stock.price);

                return {
                  ...stock,
                  price: Number(newPrice.toFixed(2)),
                  change: Number(change.toFixed(2)),
                  changePercent: Number(changePercent.toFixed(2)),
                };
              }

              return stock;
            });

            // עדכון market state
            const marketState = marketSimulator.getMarketState();

            return {
              stocks: updatedStocks,
              marketRegime: marketState.regime,
              marketStatus: marketState.status,
              vix: Number(marketState.vix.toFixed(2)),
            };
          });
        });

        set({ isSimulationRunning: true });
      },

      stopSimulation: () => {
        console.log('Stopping market simulation...');
        marketSimulator.stop();
        set({ isSimulationRunning: false });
      },

      reset: () => {
        marketSimulator.reset();
        set({
          stocks: initializeStocks(),
          marketRegime: 'sideways',
          marketStatus: 'open',
          vix: 15,
          priceHistory: new Map(),
        });
      },
    }),
    {
      name: 'stock-data-storage',
      // לא שומרים את ה-simulation state, רק את המחירים האחרונים
      partialize: (state) => ({
        stocks: state.stocks,
        marketRegime: state.marketRegime,
        vix: state.vix,
      }),
    }
  )
);

// התחלה אוטומטית של הסימולציה כשה-app נטען
if (typeof window !== 'undefined') {
  // עיכוב קטן כדי לתת לstore להיטען
  setTimeout(() => {
    const store = useStockDataStore.getState();
    if (!store.isSimulationRunning) {
      store.startSimulation();
    }
  }, 1000);
}

// ניקוי כשה-window נסגר
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const store = useStockDataStore.getState();
    store.stopSimulation();
  });
}
