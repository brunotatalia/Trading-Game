import { Card } from '../common/Card';
import { usePortfolioValue } from '../../hooks/usePortfolioValue';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency, formatPercent } from '../../utils/formatting/currency';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

export function PortfolioSummary() {
  const { value, gainLoss, gainLossPercent } = usePortfolioValue();
  const portfolio = usePortfolioStore(s => s.portfolio);

  const isPositive = gainLoss >= 0;
  const colorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const bgClass = isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

  return (
    <Card className="mb-6 card-glass">
      <div className="text-center">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Total Portfolio Value
        </h2>
        <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatCurrency(value)}
        </div>
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${bgClass} ${colorClass}`}>
          {isPositive ? (
            <ArrowTrendingUpIcon className="w-6 h-6" />
          ) : (
            <ArrowTrendingDownIcon className="w-6 h-6" />
          )}
          <div className="text-3xl font-bold">
            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
          </div>
          <div className="text-2xl font-semibold">
            ({formatPercent(gainLossPercent)})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cash Available</div>
          <div className="text-xl font-bold">{formatCurrency(portfolio.cash)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Positions</div>
          <div className="text-xl font-bold">{portfolio.positions.length}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Invested</div>
          <div className="text-xl font-bold">{formatCurrency(portfolio.startingCash - portfolio.cash)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Trades</div>
          <div className="text-xl font-bold">{portfolio.transactions.length}</div>
        </div>
      </div>
    </Card>
  );
}
