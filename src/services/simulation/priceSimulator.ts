import { GBMSimulator } from './gbmSimulator';
import { STOCKS } from '../../constants/stocks';
import type { PriceData } from '../../types/market.types';

interface StockSimulator {
  symbol: string;
  simulator: GBMSimulator;
  currentPrice: number;
  previousPrice: number;
}

export class PriceSimulator {
  private simulators: Map<string, StockSimulator> = new Map();
  private intervalId: number | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    STOCKS.forEach(stock => {
      // Random parameters for each stock
      const mu = (Math.random() * 0.3) - 0.1; // -10% to +20% annual return
      const sigma = 0.15 + (Math.random() * 0.3); // 15% to 45% volatility

      this.simulators.set(stock.symbol, {
        symbol: stock.symbol,
        simulator: new GBMSimulator(mu, sigma),
        currentPrice: stock.initialPrice,
        previousPrice: stock.initialPrice
      });
    });
  }

  start(callback: (prices: Record<string, PriceData>) => void) {
    if (this.intervalId !== null) return;

    this.intervalId = window.setInterval(() => {
      const updates = this.updateAllPrices();
      callback(updates);
    }, 1000); // Update every second
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateAllPrices(): Record<string, PriceData> {
    const updates: Record<string, PriceData> = {};

    this.simulators.forEach((sim, symbol) => {
      const newPrice = sim.simulator.simulateNextPrice(sim.currentPrice);
      const change = newPrice - sim.previousPrice;
      const changePercent = (change / sim.previousPrice) * 100;

      sim.previousPrice = sim.currentPrice;
      sim.currentPrice = newPrice;

      updates[symbol] = {
        symbol,
        price: newPrice,
        change,
        changePercent,
        lastUpdate: new Date()
      };
    });

    return updates;
  }

  getCurrentPrice(symbol: string): number {
    return this.simulators.get(symbol)?.currentPrice || 0;
  }
}
