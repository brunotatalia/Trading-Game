/**
 * Geometric Brownian Motion (GBM) Price Simulator
 * Formula: S(t+dt) = S(t) * exp((μ - 0.5σ²)dt + σ√dt·Z)
 * where Z ~ N(0,1)
 */
export class GBMSimulator {
  private mu: number;      // Annual drift (expected return)
  private sigma: number;   // Annual volatility

  constructor(mu: number, sigma: number) {
    this.mu = mu;
    this.sigma = sigma;
  }

  /**
   * Simulate next price using GBM
   * @param currentPrice Current stock price
   * @param dt Time step in years (default: 1 trading day)
   */
  simulateNextPrice(currentPrice: number, dt: number = 1/252): number {
    const Z = this.normalRandom();
    const drift = (this.mu - 0.5 * this.sigma ** 2) * dt;
    const diffusion = this.sigma * Math.sqrt(dt) * Z;

    return currentPrice * Math.exp(drift + diffusion);
  }

  /**
   * Generate standard normal random variable using Box-Muller transform
   */
  private normalRandom(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}
