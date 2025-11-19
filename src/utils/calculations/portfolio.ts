import type { Position } from '../../types/portfolio.types';

/**
 * Calculates the current value of a position based on current price
 */
export function calculatePositionValue(position: Position, currentPrice: number): number {
  return position.quantity * currentPrice;
}

/**
 * Calculates the total portfolio value including cash and all positions
 * @param portfolio - The portfolio object
 * @param prices - Current prices for all symbols
 * @returns Total portfolio value in dollars
 */
export function calculatePortfolioValue(
  portfolio: { cash: number; positions: Position[] },
  prices: Record<string, number>
): number {
  let totalValue = portfolio.cash;

  for (const position of portfolio.positions) {
    const currentPrice = prices[position.symbol] || position.currentPrice;
    totalValue += calculatePositionValue(position, currentPrice);
  }

  return totalValue;
}

/**
 * Calculates the total gain/loss for the portfolio
 * @param portfolio - The portfolio object with starting cash
 * @param prices - Current prices for all symbols
 * @returns Total profit/loss in dollars
 */
export function calculateGainLoss(
  portfolio: { cash: number; positions: Position[]; startingCash: number },
  prices: Record<string, number>
): number {
  const currentValue = calculatePortfolioValue(portfolio, prices);
  return currentValue - portfolio.startingCash;
}

/**
 * Calculates the percentage gain/loss for the portfolio
 */
export function calculateGainLossPercent(
  portfolio: { cash: number; positions: Position[]; startingCash: number },
  prices: Record<string, number>
): number {
  const gainLoss = calculateGainLoss(portfolio, prices);
  return (gainLoss / portfolio.startingCash) * 100;
}

/**
 * Calculates unrealized P&L for a position
 */
export function calculatePositionPnL(position: Position, currentPrice: number): number {
  const currentValue = position.quantity * currentPrice;
  const costBasis = position.quantity * position.averagePrice;
  return currentValue - costBasis;
}

/**
 * Calculates unrealized P&L percentage for a position
 */
export function calculatePositionPnLPercent(position: Position, currentPrice: number): number {
  const pnl = calculatePositionPnL(position, currentPrice);
  const costBasis = position.quantity * position.averagePrice;
  return (pnl / costBasis) * 100;
}

/**
 * Updates all position values based on current prices
 */
export function updatePositionValues(
  positions: Position[],
  prices: Record<string, number>
): Position[] {
  return positions.map((position) => {
    const currentPrice = prices[position.symbol] || position.currentPrice;
    const totalValue = calculatePositionValue(position, currentPrice);
    const unrealizedPnL = calculatePositionPnL(position, currentPrice);
    const unrealizedPnLPercent = calculatePositionPnLPercent(position, currentPrice);

    return {
      ...position,
      currentPrice,
      totalValue,
      unrealizedPnL,
      unrealizedPnLPercent,
      updatedAt: new Date(),
    };
  });
}

/**
 * Calculates portfolio allocation by position
 * Returns an array of positions with their allocation percentage
 */
export function calculateAllocation(
  portfolio: { cash: number; positions: Position[] },
  prices: Record<string, number>
): Array<{ symbol: string; value: number; allocation: number }> {
  const totalValue = calculatePortfolioValue(portfolio, prices);

  const allocations = portfolio.positions.map((position) => {
    const currentPrice = prices[position.symbol] || position.currentPrice;
    const value = calculatePositionValue(position, currentPrice);
    const allocation = (value / totalValue) * 100;

    return {
      symbol: position.symbol,
      value,
      allocation,
    };
  });

  // Add cash allocation
  allocations.push({
    symbol: 'CASH',
    value: portfolio.cash,
    allocation: (portfolio.cash / totalValue) * 100,
  });

  return allocations.sort((a, b) => b.allocation - a.allocation);
}

/**
 * Calculates top gainers and losers
 */
export function getTopPerformers(
  positions: Position[],
  prices: Record<string, number>,
  count = 5
): {
  topGainers: Position[];
  topLosers: Position[];
} {
  const updatedPositions = updatePositionValues(positions, prices);

  const sorted = [...updatedPositions].sort(
    (a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent
  );

  return {
    topGainers: sorted.slice(0, count),
    topLosers: sorted.slice(-count).reverse(),
  };
}
