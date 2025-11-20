export const OptionType = {
  CALL: 'CALL',
  PUT: 'PUT'
} as const;

export type OptionType = typeof OptionType[keyof typeof OptionType];

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionContract {
  id: string;
  underlying: string;
  type: OptionType;
  strike: number;
  expiration: Date;
  price: number;
  greeks: Greeks;
}
