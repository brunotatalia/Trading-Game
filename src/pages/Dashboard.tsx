import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useStockDataStore } from '../stores/stockDataStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { MarketStatusBadge } from '../components/common/MarketStatusBadge';
import { Button } from '../components/common/Button';

export const Dashboard: React.FC = () => {
  const stocks = useStockDataStore((state) => state.stocks);
  const { cash, totalValue, positions } = usePortfolioStore();
  const updatePositionPrices = usePortfolioStore(
    (state) => state.updatePositionPrices
  );

  // עדכון מחירים בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      updatePositionPrices();
    }, 1000);

    return () => clearInterval(interval);
  }, [updatePositionPrices]);

  const topGainers = [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...stocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <MarketStatusBadge />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ברוכים הבאים למשחק המסחר! 📈
        </h1>
        <p className="text-xl text-gray-600">
          התחל למסחר עם $100,000 וירטואליים - מחירים בזמן אמת עם GBM
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">כסף זמין</div>
          <div className="text-3xl font-bold">${cash.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">סה"כ שווי תיק</div>
          <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">פוזיציות פתוחות</div>
          <div className="text-3xl font-bold">{positions.length}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/trading">
            <Button variant="success" size="lg" className="w-full">
              התחל מסחר 🚀
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button variant="primary" size="lg" className="w-full">
              צפה בתיק שלי 💼
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            מובילות עליות 📈
          </h2>
          <div className="space-y-3">
            {topGainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            מובילות ירידות 📉
          </h2>
          <div className="space-y-3">
            {topLosers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div
                    className={clsx(
                      'text-sm font-semibold',
                      stock.changePercent < 0 ? 'text-red-600' : 'text-green-600'
                    )}
                  >
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
