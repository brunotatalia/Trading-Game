import { GBMSimulator } from './gbmSimulator';
import type { StockConfig } from '../../constants/stocks';

interface StockSimulation {
  symbol: string;
  gbm: GBMSimulator;
  currentPrice: number;
  previousPrice: number;
  priceHistory: number[]; // Last 30 days (at 1 minute intervals = 30 * 6.5 * 60 = 11,700 points)
  config: StockConfig;
}

export class PriceSimulator {
  private simulations: Map<string, StockSimulation> = new Map();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;
  private updateCallback?: (updates: Map<string, number>) => void;

  // תדירות עדכון - 1 שנייה
  private readonly UPDATE_INTERVAL = 1000;

  // dt לחישוב GBM (1 שנייה בשנים: 1/(252 ימי מסחר * 6.5 שעות * 3600 שניות))
  private readonly DT = 1 / (252 * 6.5 * 3600);

  // שמירת 30 ימים של נתונים (בדקות)
  private readonly MAX_HISTORY_LENGTH = 30 * 6.5 * 60; // 11,700 נקודות

  constructor(stockConfigs: StockConfig[]) {
    this.initializeSimulations(stockConfigs);
  }

  /**
   * אתחול סימולציות לכל המניות
   */
  private initializeSimulations(stockConfigs: StockConfig[]): void {
    stockConfigs.forEach((config) => {
      const gbm = new GBMSimulator(config.baseDrift, config.baseVolatility);

      this.simulations.set(config.symbol, {
        symbol: config.symbol,
        gbm,
        currentPrice: config.initialPrice,
        previousPrice: config.initialPrice,
        priceHistory: [config.initialPrice],
        config,
      });
    });
  }

  /**
   * התחלת הסימולציה
   */
  start(updateCallback?: (updates: Map<string, number>) => void): void {
    if (this.isRunning) {
      console.warn('Price simulation is already running');
      return;
    }

    this.updateCallback = updateCallback;
    this.isRunning = true;

    // עדכון ראשוני
    this.updateAllPrices();

    // עדכון תקופתי
    this.intervalId = setInterval(() => {
      this.updateAllPrices();
    }, this.UPDATE_INTERVAL);

    console.log('Price simulation started');
  }

  /**
   * עצירת הסימולציה
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('Price simulation stopped');
  }

  /**
   * עדכון כל המחירים
   */
  private updateAllPrices(): void {
    const updates = new Map<string, number>();

    this.simulations.forEach((sim, symbol) => {
      // שמירת המחיר הקודם
      sim.previousPrice = sim.currentPrice;

      // חישוב מחיר חדש עם GBM
      sim.currentPrice = sim.gbm.simulateNextPrice(sim.currentPrice, this.DT);

      // הוספה להיסטוריה
      sim.priceHistory.push(sim.currentPrice);

      // שמירה רק על 30 ימים אחרונים
      if (sim.priceHistory.length > this.MAX_HISTORY_LENGTH) {
        sim.priceHistory.shift();
      }

      updates.set(symbol, sim.currentPrice);
    });

    // קריאה ל-callback עם העדכונים
    if (this.updateCallback) {
      this.updateCallback(updates);
    }
  }

  /**
   * קבלת מחיר נוכחי
   */
  getCurrentPrice(symbol: string): number | undefined {
    return this.simulations.get(symbol)?.currentPrice;
  }

  /**
   * קבלת מחיר קודם
   */
  getPreviousPrice(symbol: string): number | undefined {
    return this.simulations.get(symbol)?.previousPrice;
  }

  /**
   * קבלת היסטוריית מחירים
   * @param symbol - סימבול המניה
   * @param days - מספר ימים (ברירת מחדל: 30)
   * @returns מערך מחירים
   */
  getPriceHistory(symbol: string, days: number = 30): number[] {
    const sim = this.simulations.get(symbol);
    if (!sim) return [];

    // חישוב מספר נקודות (1 דקה לכל נקודה)
    const numPoints = days * 6.5 * 60;

    // החזרת N נקודות אחרונות
    return sim.priceHistory.slice(-numPoints);
  }

  /**
   * עדכון פרמטרי GBM (לדוגמה: שינוי תנודתיות בזמן אירועים)
   */
  updateParameters(
    symbol: string,
    mu?: number,
    sigma?: number
  ): void {
    const sim = this.simulations.get(symbol);
    if (!sim) return;

    const currentParams = sim.gbm.getParameters();
    sim.gbm.updateParameters(
      mu ?? currentParams.mu,
      sigma ?? currentParams.sigma
    );
  }

  /**
   * קבלת כל המחירים הנוכחיים
   */
  getAllCurrentPrices(): Map<string, number> {
    const prices = new Map<string, number>();
    this.simulations.forEach((sim, symbol) => {
      prices.set(symbol, sim.currentPrice);
    });
    return prices;
  }

  /**
   * בדיקה אם הסימולציה רצה
   */
  isSimulationRunning(): boolean {
    return this.isRunning;
  }

  /**
   * איפוס הסימולציה למחירים ראשוניים
   */
  reset(): void {
    this.simulations.forEach((sim) => {
      sim.currentPrice = sim.config.initialPrice;
      sim.previousPrice = sim.config.initialPrice;
      sim.priceHistory = [sim.config.initialPrice];
      sim.gbm = new GBMSimulator(
        sim.config.baseDrift,
        sim.config.baseVolatility
      );
    });

    console.log('Price simulation reset');
  }

  /**
   * שמירת נתונים (לשימוש עם localStorage)
   */
  saveState(): string {
    const state = Array.from(this.simulations.entries()).map(
      ([symbol, sim]) => ({
        symbol,
        currentPrice: sim.currentPrice,
        previousPrice: sim.previousPrice,
        priceHistory: sim.priceHistory,
      })
    );

    return JSON.stringify(state);
  }

  /**
   * טעינת נתונים (מ-localStorage)
   */
  loadState(stateJson: string): void {
    try {
      const state = JSON.parse(stateJson);

      state.forEach(
        (item: {
          symbol: string;
          currentPrice: number;
          previousPrice: number;
          priceHistory: number[];
        }) => {
          const sim = this.simulations.get(item.symbol);
          if (sim) {
            sim.currentPrice = item.currentPrice;
            sim.previousPrice = item.previousPrice;
            sim.priceHistory = item.priceHistory;
          }
        }
      );

      console.log('Price simulation state loaded');
    } catch (error) {
      console.error('Failed to load price simulation state:', error);
    }
  }
}
