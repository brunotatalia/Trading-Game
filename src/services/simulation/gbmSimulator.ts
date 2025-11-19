/**
 * Geometric Brownian Motion (GBM) Simulator
 *
 * מודל מתמטי לסימולציית מחירי מניות:
 * S(t+dt) = S(t) * exp((mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z)
 *
 * כאשר:
 * - S(t) = מחיר נוכחי
 * - mu = drift (תשואה צפויה שנתית)
 * - sigma = volatility (תנודתיות שנתית)
 * - dt = פרק זמן (בשנים)
 * - Z ~ N(0,1) = משתנה אקראי נורמלי
 */

export class GBMSimulator {
  private mu: number; // drift (annual return)
  private sigma: number; // volatility (annual)

  constructor(mu: number, sigma: number) {
    this.mu = mu;
    this.sigma = sigma;
  }

  /**
   * Box-Muller Transform
   * ממיר התפלגות uniform ל-normal distribution
   */
  private normalRandom(): number {
    let u = 0;
    let v = 0;

    // ודא שלא נקבל 0 (שיכול לגרום ל-log(0) = -∞)
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    // Box-Muller transform
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z;
  }

  /**
   * סימולציה של מחיר הבא
   * @param currentPrice - המחיר הנוכחי
   * @param dt - פרק זמן בשנים (לדוגמה: 1/252 ליום מסחר, 1/252/6.5/3600 לשנייה)
   * @returns המחיר החדש
   */
  simulateNextPrice(currentPrice: number, dt: number): number {
    const Z = this.normalRandom();

    // GBM formula
    const drift = (this.mu - 0.5 * this.sigma ** 2) * dt;
    const diffusion = this.sigma * Math.sqrt(dt) * Z;
    const exponent = drift + diffusion;

    const nextPrice = currentPrice * Math.exp(exponent);

    // ודא שהמחיר לא שלילי או אפס
    return Math.max(nextPrice, 0.01);
  }

  /**
   * עדכון פרמטרי המודל
   */
  updateParameters(mu: number, sigma: number): void {
    this.mu = mu;
    this.sigma = sigma;
  }

  /**
   * קבלת פרמטרים נוכחיים
   */
  getParameters(): { mu: number; sigma: number } {
    return { mu: this.mu, sigma: this.sigma };
  }

  /**
   * סימולציה של מסלול שלם (לחישובים עתידיים)
   */
  simulatePath(
    startPrice: number,
    steps: number,
    dt: number
  ): number[] {
    const path: number[] = [startPrice];
    let currentPrice = startPrice;

    for (let i = 0; i < steps; i++) {
      currentPrice = this.simulateNextPrice(currentPrice, dt);
      path.push(currentPrice);
    }

    return path;
  }
}
