import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import { initializePrices } from './utils/initializePrices';
import { usePortfolioValue } from './hooks/usePortfolioValue';
import { useUserStore } from './stores/userStore';

function App() {
  const { value, gainLoss, gainLossPercent, cash, positionCount } = usePortfolioValue();
  const { username, level, xp } = useUserStore();

  // Initialize prices on mount
  useEffect(() => {
    initializePrices();
  }, []);

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
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Portfolio Overview */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {username}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(value)}</p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${
                  gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(gainLoss)} ({formatPercent(gainLossPercent)})
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Cash</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(cash)}</p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Positions</p>
              <p className="text-2xl font-bold text-gray-900">{positionCount}</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Level {level} Trader</p>
              <div className="mt-2 w-64 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(xp / (level * 1000)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {xp} / {level * 1000} XP
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="card">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Game</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your journey to mastering trading starts here
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Learn to Trade
                </h3>
                <p className="text-primary-700">
                  Practice trading strategies without risking real money
                </p>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Track Performance
                </h3>
                <p className="text-green-700">
                  Monitor your portfolio and analyze your trading decisions
                </p>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Build Skills
                </h3>
                <p className="text-purple-700">
                  Improve your trading skills through realistic simulations
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button className="btn-primary">Start Trading</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
