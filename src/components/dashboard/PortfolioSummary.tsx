import { Card } from '../common/Card';
import { usePortfolioValue } from '../../hooks/usePortfolioValue';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency, formatPercent } from '../../utils/formatting/currency';

export function PortfolioSummary() {
  const { value, gainLoss, gainLossPercent } = usePortfolioValue();
  const portfolio = usePortfolioStore(s => s.portfolio);

  const isPositive = gainLoss >= 0;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="mb-6">
      <div className="text-center">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h2>
        <div className="text-5xl font-bold mb-2">{formatCurrency(value)}</div>
        <div className={`text-2xl font-semibold ${colorClass}`}>
          {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({formatPercent(gainLossPercent)})
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div>
          <div className="text-sm text-gray-500">Cash</div>
          <div className="text-lg font-semibold">{formatCurrency(portfolio.cash)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Positions</div>
          <div className="text-lg font-semibold">{portfolio.positions.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Invested</div>
          <div className="text-lg font-semibold">{formatCurrency(portfolio.startingCash - portfolio.cash)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Trades</div>
          <div className="text-lg font-semibold">{portfolio.transactions.length}</div>
        </div>
      </div>
    </Card>
  );
}
