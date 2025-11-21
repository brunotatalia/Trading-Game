import { useMemo } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceStore } from '../stores/priceStore';
import { calculatePortfolioValue, calculateGainLoss } from '../utils/calculations/portfolio';

export function usePortfolioValue() {
  const portfolio = usePortfolioStore(s => s.portfolio);
  const prices = usePriceStore(s => s.prices);

  return useMemo(() => {
    const priceMap: Record<string, number> = {};
    Object.entries(prices).forEach(([symbol, data]) => {
      priceMap[symbol] = data.price;
    });

    const value = calculatePortfolioValue(portfolio, priceMap);
    const gainLoss = calculateGainLoss(portfolio, priceMap);
    const gainLossPercent = ((value - portfolio.startingCash) / portfolio.startingCash) * 100;

    return { value, gainLoss, gainLossPercent };
  }, [portfolio, prices]);
}
