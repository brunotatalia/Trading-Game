import { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import { formatCurrency, formatPercent, formatPrice } from '../../utils/formatting/currency';
import { calculatePositionValue, calculatePositionPL, calculatePositionPLPercent } from '../../utils/calculations/portfolio';
import { STOCKS } from '../../constants/stocks';

export function PositionsList() {
  const positions = usePortfolioStore(s => s.portfolio.positions);
  const prices = usePriceStore(s => s.prices);
  const executeTrade = usePortfolioStore(s => s.executeTrade);
  const [selling, setSelling] = useState<string | null>(null);

  const handleQuickSell = (symbol: string, quantity: number) => {
    const currentPrice = prices[symbol]?.price;
    if (!currentPrice) return;

    setSelling(symbol);

    const result = executeTrade({
      symbol,
      side: 'SELL',
      quantity,
      type: 'MARKET'
    }, currentPrice);

    setTimeout(() => {
      if (result.success) {
        alert(`Sold ${quantity} ${symbol} at $${formatPrice(currentPrice)}`);
      } else {
        alert(`${result.error}`);
      }
      setSelling(null);
    }, 500);
  };

  if (positions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No positions yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Start trading to build your portfolio!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Your Positions</h3>
        <Badge variant="info">{positions.length} Active</Badge>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-gray-200 dark:border-gray-700">
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="pb-3 font-semibold">Symbol</th>
              <th className="pb-3 font-semibold">Quantity</th>
              <th className="pb-3 font-semibold">Avg Cost</th>
              <th className="pb-3 font-semibold">Current</th>
              <th className="pb-3 font-semibold">Value</th>
              <th className="pb-3 font-semibold">P&L</th>
              <th className="pb-3 font-semibold">P&L %</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
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
                <tr key={pos.symbol} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-lg">{pos.symbol}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stock?.name}</div>
                  </td>
                  <td className="py-4 font-semibold">{pos.quantity}</td>
                  <td className="py-4">${formatPrice(pos.averageCost)}</td>
                  <td className="py-4 font-semibold">${formatPrice(currentPrice)}</td>
                  <td className="py-4 font-bold">{formatCurrency(value)}</td>
                  <td className={`py-4 font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(pl)}
                  </td>
                  <td className="py-4">
                    <Badge variant={isPositive ? 'success' : 'danger'} size="md">
                      {formatPercent(plPercent)}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleQuickSell(pos.symbol, pos.quantity)}
                      disabled={selling === pos.symbol}
                    >
                      {selling === pos.symbol ? 'Selling...' : 'Quick Sell'}
                    </Button>
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
            <div key={pos.symbol} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-xl">{pos.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stock?.name}</div>
                </div>
                <Badge variant={isPositive ? 'success' : 'danger'}>
                  {formatPercent(plPercent)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Quantity</div>
                  <div className="font-semibold">{pos.quantity}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Value</div>
                  <div className="font-semibold">{formatCurrency(value)}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Cost</div>
                  <div className="font-medium">${formatPrice(pos.averageCost)}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">P&L</div>
                  <div className={`font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(pl)}
                  </div>
                </div>
              </div>

              <Button
                variant="danger"
                fullWidth
                onClick={() => handleQuickSell(pos.symbol, pos.quantity)}
                disabled={selling === pos.symbol}
              >
                {selling === pos.symbol ? 'Selling...' : `Sell All ${pos.symbol}`}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
