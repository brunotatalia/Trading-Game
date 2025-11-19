import { useMemo } from 'react';
import { usePortfolioValue } from '../../hooks/usePortfolioValue';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import Card from '../common/Card';
import Badge from '../common/Badge';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function PortfolioSummary() {
  const { value, gainLoss, gainLossPercent, cash, positionCount } = usePortfolioValue();
  const positions = usePortfolioStore((state) => state.positions);
  const prices = usePriceStore((state) => state.prices);

  // Calculate best performer
  const bestPerformer = useMemo(() => {
    if (positions.length === 0) return null;

    const positionsWithPnL = positions.map((position) => {
      const currentPrice = prices[position.symbol]?.price || position.currentPrice;
      const pnlPercent = ((currentPrice - position.averagePrice) / position.averagePrice) * 100;
      return { ...position, pnlPercent };
    });

    return positionsWithPnL.reduce((best, current) =>
      current.pnlPercent > best.pnlPercent ? current : best
    );
  }, [positions, prices]);

  // Calculate day P&L (simplified: using total unrealized P&L)
  const dayPnL = useMemo(() => {
    return positions.reduce((total, position) => {
      const currentPrice = prices[position.symbol]?.price || position.currentPrice;
      const pnl = position.quantity * (currentPrice - position.averagePrice);
      return total + pnl;
    }, 0);
  }, [positions, prices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Main Portfolio Value */}
      <Card padding="lg" className="text-center">
        <p className="text-sm text-gray-500 mb-2">Total Portfolio Value</p>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">{formatCurrency(value)}</h1>

        <div className="flex items-center justify-center gap-2">
          <Badge variant={gainLoss >= 0 ? 'success' : 'danger'} size="lg" showIcon>
            {formatCurrency(Math.abs(gainLoss))} ({formatPercent(gainLossPercent)})
          </Badge>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Cash Available</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(cash)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {((cash / value) * 100).toFixed(1)}% of portfolio
              </p>
            </div>
            <div className="p-2 bg-primary-50 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        {/* Positions */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Positions</p>
              <p className="text-2xl font-bold text-gray-900">{positionCount}</p>
              <p className="text-xs text-gray-400 mt-1">
                {positionCount === 0
                  ? 'No positions'
                  : positionCount === 1
                    ? '1 stock held'
                    : `${positionCount} stocks held`}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Day P&L */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Unrealized P&L</p>
              <p
                className={`text-2xl font-bold ${
                  dayPnL >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(dayPnL)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {positionCount > 0 ? 'Across all positions' : 'No positions'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${dayPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <CurrencyDollarIcon
                className={`w-6 h-6 ${dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}
              />
            </div>
          </div>
        </Card>

        {/* Best Performer */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Best Performer</p>
              {bestPerformer ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">{bestPerformer.symbol}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatPercent(bestPerformer.pnlPercent)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-400">—</p>
                  <p className="text-xs text-gray-400 mt-1">No positions</p>
                </>
              )}
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
