interface OptionParams {
  S: number;  // Stock price
  K: number;  // Strike
  T: number;  // Time to expiry (years)
  r: number;  // Risk-free rate
  sigma: number;  // Volatility
}

export class BlackScholesCalculator {
  static callPrice(params: OptionParams): number {
    const { d1, d2 } = this.calcD1D2(params);
    return params.S * this.normCDF(d1) -
           params.K * Math.exp(-params.r * params.T) * this.normCDF(d2);
  }

  static putPrice(params: OptionParams): number {
    const { d1, d2 } = this.calcD1D2(params);
    return params.K * Math.exp(-params.r * params.T) * this.normCDF(-d2) -
           params.S * this.normCDF(-d1);
  }

  private static calcD1D2(params: OptionParams) {
    const { S, K, T, r, sigma } = params;
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return { d1, d2 };
  }

  private static normCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 +
              t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }
}
