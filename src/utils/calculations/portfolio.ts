import type { Portfolio, Position } from '../../types/portfolio.types';

export function calculatePortfolioValue(
  portfolio: Portfolio,
  prices: Record<string, number>
): number {
  const positionsValue = portfolio.positions.reduce((sum, pos) => {
    const price = prices[pos.symbol] || pos.currentPrice;
    return sum + pos.quantity * price;
  }, 0);

  return portfolio.cash + positionsValue;
}

export function calculateGainLoss(
  portfolio: Portfolio,
  prices: Record<string, number>
): number {
  const currentValue = calculatePortfolioValue(portfolio, prices);
  return currentValue - portfolio.startingCash;
}

export function calculatePositionValue(position: Position, currentPrice: number): number {
  return position.quantity * currentPrice;
}

export function calculatePositionPL(position: Position, currentPrice: number): number {
  return (currentPrice - position.averageCost) * position.quantity;
}

export function calculatePositionPLPercent(position: Position, currentPrice: number): number {
  return ((currentPrice - position.averageCost) / position.averageCost) * 100;
}
