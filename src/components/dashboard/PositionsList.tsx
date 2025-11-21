import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import { formatCurrency, formatPercent, formatPrice } from '../../utils/formatting/currency';
import { calculatePositionValue, calculatePositionPL, calculatePositionPLPercent } from '../../utils/calculations/portfolio';
import { STOCKS } from '../../constants/stocks';

export function PositionsList() {
  const positions = usePortfolioStore(s => s.portfolio.positions);
  const prices = usePriceStore(s => s.prices);

  if (positions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-medium">No positions yet</p>
          <p className="text-sm mt-2">Start trading to build your portfolio!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Positions</h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-3">Symbol</th>
              <th className="pb-3">Quantity</th>
              <th className="pb-3">Avg Cost</th>
              <th className="pb-3">Current</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">P&L</th>
              <th className="pb-3">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(pos => {
              const currentPrice = prices[pos.symbol]?.price || pos.currentPrice;
              const value = calculatePositionValue(pos, currentPrice);
              const pl = calculatePositionPL(pos, currentPrice);
              const plPercent = calculatePositionPLPercent(pos, currentPrice);
              const isPositive = pl >= 0;
              const stock = STOCKS.find(s => s.symbol === pos.symbol);

              return (
                <tr key={pos.symbol} className="border-b last:border-0">
                  <td className="py-4">
                    <div className="font-semibold">{pos.symbol}</div>
                    <div className="text-sm text-gray-500">{stock?.name}</div>
                  </td>
                  <td className="py-4">{pos.quantity}</td>
                  <td className="py-4">${formatPrice(pos.averageCost)}</td>
                  <td className="py-4">${formatPrice(currentPrice)}</td>
                  <td className="py-4">{formatCurrency(value)}</td>
                  <td className={`py-4 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(pl)}
                  </td>
                  <td className="py-4">
                    <Badge variant={isPositive ? 'success' : 'danger'}>
                      {formatPercent(plPercent)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {positions.map(pos => {
          const currentPrice = prices[pos.symbol]?.price || pos.currentPrice;
          const value = calculatePositionValue(pos, currentPrice);
          const pl = calculatePositionPL(pos, currentPrice);
          const plPercent = calculatePositionPLPercent(pos, currentPrice);
          const isPositive = pl >= 0;
          const stock = STOCKS.find(s => s.symbol === pos.symbol);

          return (
            <div key={pos.symbol} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-lg">{pos.symbol}</div>
                  <div className="text-sm text-gray-500">{stock?.name}</div>
                </div>
                <Badge variant={isPositive ? 'success' : 'danger'}>
                  {formatPercent(plPercent)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <div className="text-gray-500">Quantity</div>
                  <div className="font-medium">{pos.quantity}</div>
                </div>
                <div>
                  <div className="text-gray-500">Value</div>
                  <div className="font-medium">{formatCurrency(value)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Avg Cost</div>
                  <div className="font-medium">${formatPrice(pos.averageCost)}</div>
                </div>
                <div>
                  <div className="text-gray-500">P&L</div>
                  <div className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(pl)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
