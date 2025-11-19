import { useMemo } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceStore } from '../stores/priceStore';
import {
  calculatePortfolioValue,
  calculateGainLoss,
  calculateGainLossPercent,
} from '../utils/calculations/portfolio';

interface PortfolioValue {
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  cash: number;
  investedValue: number;
  positionCount: number;
}

/**
 * Hook that calculates real-time portfolio value
 * Combines data from portfolio and price stores
 */
export function usePortfolioValue(): PortfolioValue {
  // Get portfolio state
  const cash = usePortfolioStore((state) => state.cash);
  const positions = usePortfolioStore((state) => state.positions);
  const startingCash = usePortfolioStore((state) => state.startingCash);

  // Get price state
  const prices = usePriceStore((state) => state.prices);

  // Convert prices to simple Record<string, number>
  const priceMap = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(prices).forEach(([symbol, priceData]) => {
      map[symbol] = priceData.price;
    });
    return map;
  }, [prices]);

  // Calculate portfolio value
  const value = useMemo(() => {
    return calculatePortfolioValue({ cash, positions }, priceMap);
  }, [cash, positions, priceMap]);

  // Calculate gain/loss
  const gainLoss = useMemo(() => {
    return calculateGainLoss({ cash, positions, startingCash }, priceMap);
  }, [cash, positions, startingCash, priceMap]);

  // Calculate gain/loss percentage
  const gainLossPercent = useMemo(() => {
    return calculateGainLossPercent({ cash, positions, startingCash }, priceMap);
  }, [cash, positions, startingCash, priceMap]);

  // Calculate invested value
  const investedValue = useMemo(() => {
    let total = 0;
    positions.forEach((position) => {
      const currentPrice = priceMap[position.symbol] || position.currentPrice;
      total += position.quantity * currentPrice;
    });
    return total;
  }, [positions, priceMap]);

  return {
    value,
    gainLoss,
    gainLossPercent,
    cash,
    investedValue,
    positionCount: positions.length,
  };
}
