import { PriceSimulator } from './priceSimulator';
import type { StockConfig } from '../../constants/stocks';

export type MarketRegime = 'bull' | 'bear' | 'sideways';
export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'after-hours';

interface MarketState {
  regime: MarketRegime;
  vix: number; // תנודתיות שוק (0-100, רגיל: 10-20)
  status: MarketStatus;
  lastUpdate: Date;
}

export class MarketSimulator {
  private priceSimulator: PriceSimulator;
  private marketState: MarketState;
  private regimeChangeInterval: ReturnType<typeof setInterval> | null = null;

  // VIX parameters
  private readonly MIN_VIX = 10;
  private readonly MAX_VIX = 80;
  private readonly NORMAL_VIX = 15;

  constructor(stockConfigs: StockConfig[]) {
    this.priceSimulator = new PriceSimulator(stockConfigs);

    this.marketState = {
      regime: 'sideways',
      vix: this.NORMAL_VIX,
      status: 'open', // בינתיים תמיד פתוח
      lastUpdate: new Date(),
    };
  }

  /**
   * התחלת הסימולציה
   */
  start(updateCallback?: (updates: Map<string, number>) => void): void {
    // התחלת סימולציית מחירים
    this.priceSimulator.start((updates) => {
      // עדכון VIX בהתאם לתנודתיות
      this.updateVIX();

      // קריאה ל-callback
      if (updateCallback) {
        updateCallback(updates);
      }
    });

    // שינוי market regime כל 5 דקות (בממוצע)
    this.startRegimeChanges();
  }

  /**
   * עצירת הסימולציה
   */
  stop(): void {
    this.priceSimulator.stop();

    if (this.regimeChangeInterval) {
      clearInterval(this.regimeChangeInterval);
      this.regimeChangeInterval = null;
    }
  }

  /**
   * שינויים תקופתיים ב-market regime
   */
  private startRegimeChanges(): void {
    // בדיקה כל דקה האם לשנות regime
    this.regimeChangeInterval = setInterval(() => {
      // סיכוי של 5% לשינוי regime כל דקה
      if (Math.random() < 0.05) {
        this.changeRegime();
      }
    }, 60000); // כל דקה
  }

  /**
   * שינוי market regime
   */
  private changeRegime(): void {
    const regimes: MarketRegime[] = ['bull', 'bear', 'sideways'];
    const currentIndex = regimes.indexOf(this.marketState.regime);

    // בחירת regime חדש (לא אותו regime)
    const availableRegimes = regimes.filter((_, i) => i !== currentIndex);
    const newRegime =
      availableRegimes[Math.floor(Math.random() * availableRegimes.length)];

    this.marketState.regime = newRegime;
    this.marketState.lastUpdate = new Date();

    console.log(`Market regime changed to: ${newRegime}`);

    // עדכון פרמטרים של כל המניות בהתאם ל-regime
    this.adjustParametersForRegime(newRegime);
  }

  /**
   * התאמת פרמטרים לפי regime
   */
  private adjustParametersForRegime(regime: MarketRegime): void {
    // bull: drift חיובי יותר, volatility נמוכה יותר
    // bear: drift שלילי, volatility גבוהה
    // sideways: drift קרוב ל-0, volatility בינונית

    // TODO: עדכון פרמטרים דרך PriceSimulator
    // נדרוש הרחבה של PriceSimulator API
    console.log(`Adjusting parameters for ${regime} regime`);
  }

  /**
   * עדכון VIX (תנודתיות שוק)
   */
  private updateVIX(): void {
    const { regime } = this.marketState;

    // VIX ממוצע לפי regime
    const targetVIX = {
      bull: 12,
      bear: 30,
      sideways: 15,
    }[regime];

    // תנועה הדרגתית לכיוון ה-target VIX
    const change = (targetVIX - this.marketState.vix) * 0.01;
    const noise = (Math.random() - 0.5) * 2; // רעש

    this.marketState.vix = Math.max(
      this.MIN_VIX,
      Math.min(this.MAX_VIX, this.marketState.vix + change + noise)
    );
  }

  /**
   * קבלת מצב השוק
   */
  getMarketState(): MarketState {
    return { ...this.marketState };
  }

  /**
   * קבלת VIX נוכחי
   */
  getVIX(): number {
    return this.marketState.vix;
  }

  /**
   * קבלת regime נוכחי
   */
  getRegime(): MarketRegime {
    return this.marketState.regime;
  }

  /**
   * קבלת סטטוס השוק
   */
  getMarketStatus(): MarketStatus {
    return this.marketState.status;
  }

  /**
   * גישה ל-PriceSimulator
   */
  getPriceSimulator(): PriceSimulator {
    return this.priceSimulator;
  }

  /**
   * קבלת מחיר נוכחי
   */
  getCurrentPrice(symbol: string): number | undefined {
    return this.priceSimulator.getCurrentPrice(symbol);
  }

  /**
   * קבלת היסטוריית מחירים
   */
  getPriceHistory(symbol: string, days: number = 30): number[] {
    return this.priceSimulator.getPriceHistory(symbol, days);
  }

  /**
   * קבלת כל המחירים
   */
  getAllCurrentPrices(): Map<string, number> {
    return this.priceSimulator.getAllCurrentPrices();
  }

  /**
   * איפוס
   */
  reset(): void {
    this.priceSimulator.reset();
    this.marketState = {
      regime: 'sideways',
      vix: this.NORMAL_VIX,
      status: 'open',
      lastUpdate: new Date(),
    };
  }

  /**
   * שמירה וטעינה
   */
  saveState(): { prices: string; market: MarketState } {
    return {
      prices: this.priceSimulator.saveState(),
      market: this.marketState,
    };
  }

  loadState(state: { prices: string; market: MarketState }): void {
    this.priceSimulator.loadState(state.prices);
    this.marketState = state.market;
  }
}
