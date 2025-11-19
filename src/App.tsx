import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import { initializePrices } from './utils/initializePrices';
import { useUserStore } from './stores/userStore';
import PortfolioSummary from './components/dashboard/PortfolioSummary';
import QuickStats from './components/dashboard/QuickStats';
import PositionsList from './components/dashboard/PositionsList';

function App() {
  const { username, level, xp } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize prices and mock data on mount
  useEffect(() => {
    initializePrices();

    // Initialize mock portfolio for demo (comment out if you want to start fresh)
    // Uncomment the line below to start with sample positions
    // initializeMockPortfolio();

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your portfolio...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with User Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {username}!
            </h1>
            <p className="text-gray-500 mt-1">Track your portfolio and make smart trades</p>
          </div>

          {/* User Level Badge */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-md p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Level {level} Trader</p>
                <span className="text-xs font-medium text-primary-600">
                  {xp} / {level * 1000} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(xp / (level * 1000)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary />

        {/* Quick Stats */}
        <QuickStats />

        {/* Positions List */}
        <PositionsList />

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Open your browser console and try:{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">
              import {'{'} initializeMockPortfolio {'}'} from './utils/mockData';
              initializeMockPortfolio();
            </code>
            {' '}to add sample positions for testing.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
