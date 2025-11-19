import { useMemo } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import Card from '../common/Card';
import {
  ChartPieIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

export default function QuickStats() {
  const positions = usePortfolioStore((state) => state.positions);
  const transactions = usePortfolioStore((state) => state.transactions);
  const startingCash = usePortfolioStore((state) => state.startingCash);
  const cash = usePortfolioStore((state) => state.cash);
  const prices = usePriceStore((state) => state.prices);

  // Calculate total invested
  const totalInvested = useMemo(() => {
    return startingCash - cash;
  }, [startingCash, cash]);

  // Calculate total return
  const totalReturn = useMemo(() => {
    let totalValue = 0;
    positions.forEach((position) => {
      const currentPrice = prices[position.symbol]?.price || position.currentPrice;
      totalValue += position.quantity * currentPrice;
    });
    const totalCost = positions.reduce(
      (sum, p) => sum + p.quantity * p.averagePrice,
      0
    );
    return totalValue - totalCost;
  }, [positions, prices]);

  // Calculate win rate
  const winRate = useMemo(() => {
    if (positions.length === 0) return 0;

    const profitablePositions = positions.filter((position) => {
      const currentPrice = prices[position.symbol]?.price || position.currentPrice;
      return currentPrice > position.averagePrice;
    });

    return (profitablePositions.length / positions.length) * 100;
  }, [positions, prices]);

  // Count trades
  const numberOfTrades = useMemo(() => {
    return transactions.filter((t) => t.type === 'BUY' || t.type === 'SELL').length;
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Invested',
      value: formatCurrency(totalInvested),
      icon: ChartPieIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Return',
      value: formatCurrency(totalReturn),
      icon: ArrowTrendingUpIcon,
      color: totalReturn >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalReturn >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Win Rate',
      value: positions.length > 0 ? `${winRate.toFixed(1)}%` : '—',
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Total Trades',
      value: numberOfTrades.toString(),
      icon: ShoppingCartIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
