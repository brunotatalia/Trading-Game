import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useGamificationStore } from '../stores/gamificationStore';
import { formatCurrency, formatPrice } from '../utils/formatting/currency';
import { STOCKS } from '../constants/stocks';

export function History() {
  const tradeHistory = useGamificationStore(s => s.tradeHistory);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  const filteredHistory = tradeHistory.filter(trade => {
    if (filter === 'all') return true;
    return trade.side.toLowerCase() === filter;
  });

  const totalTrades = tradeHistory.length;
  const buyTrades = tradeHistory.filter(t => t.side === 'BUY').length;
  const sellTrades = tradeHistory.filter(t => t.side === 'SELL').length;
  const totalVolume = tradeHistory.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">📜 Trade History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review your past trading activity
        </p>
      </div>

      {/* Stats Overview */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalTrades}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Trades</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {buyTrades}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Buy Orders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {sellTrades}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Sell Orders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalVolume)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Volume</div>
          </div>
        </div>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All ({totalTrades})
        </Button>
        <Button
          variant={filter === 'buy' ? 'success' : 'secondary'}
          onClick={() => setFilter('buy')}
        >
          Buys ({buyTrades})
        </Button>
        <Button
          variant={filter === 'sell' ? 'danger' : 'secondary'}
          onClick={() => setFilter('sell')}
        >
          Sells ({sellTrades})
        </Button>
      </div>

      {/* Trade List */}
      <Card>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
              No trades yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start trading to see your history here!
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                  <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                    <th className="pb-3 font-semibold">Date & Time</th>
                    <th className="pb-3 font-semibold">Symbol</th>
                    <th className="pb-3 font-semibold">Side</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(trade => {
                    const stock = STOCKS.find(s => s.symbol === trade.symbol);
                    const isBuy = trade.side === 'BUY';

                    return (
                      <tr
                        key={trade.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="text-sm font-medium">
                            {new Date(trade.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(trade.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-bold">{trade.symbol}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stock?.name}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={isBuy ? 'success' : 'danger'}>
                            {trade.side}
                          </Badge>
                        </td>
                        <td className="py-4 font-semibold">{trade.quantity}</td>
                        <td className="py-4">${formatPrice(trade.price)}</td>
                        <td className="py-4 font-bold">{formatCurrency(trade.total)}</td>
                        <td className="py-4">
                          {trade.profit !== undefined ? (
                            <span
                              className={`font-bold ${
                                trade.profit >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {trade.profit >= 0 ? '+' : ''}
                              {formatCurrency(trade.profit)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredHistory.map(trade => {
                const stock = STOCKS.find(s => s.symbol === trade.symbol);
                const isBuy = trade.side === 'BUY';

                return (
                  <div
                    key={trade.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-lg">{trade.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stock?.name}
                        </div>
                      </div>
                      <Badge variant={isBuy ? 'success' : 'danger'}>{trade.side}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Quantity</div>
                        <div className="font-semibold">{trade.quantity}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Price</div>
                        <div className="font-semibold">${formatPrice(trade.price)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Total</div>
                        <div className="font-bold">{formatCurrency(trade.total)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">P&L</div>
                        <div
                          className={`font-bold ${
                            trade.profit && trade.profit >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {trade.profit !== undefined
                            ? `${trade.profit >= 0 ? '+' : ''}${formatCurrency(trade.profit)}`
                            : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-right">
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
