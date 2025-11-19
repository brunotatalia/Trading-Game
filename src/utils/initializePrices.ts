import { usePriceStore } from '../stores/priceStore';
import { AVAILABLE_ASSETS } from '../constants/assets';
import type { PriceData } from '../types/market.types';

/**
 * Initializes prices for all available assets
 * Should be called once on app startup
 */
export function initializePrices(): void {
  const priceStore = usePriceStore.getState();

  const initialPrices: Record<string, PriceData> = {};

  AVAILABLE_ASSETS.forEach((asset) => {
    initialPrices[asset.symbol] = {
      symbol: asset.symbol,
      price: asset.initialPrice,
      change: 0,
      changePercent: 0,
      high: asset.initialPrice,
      low: asset.initialPrice,
      open: asset.initialPrice,
      previousClose: asset.initialPrice,
      volume: Math.floor(Math.random() * 1000000) + 100000, // Random initial volume
      timestamp: new Date(),
    };
  });

  priceStore.setPrices(initialPrices);
}
