import { useState, useMemo } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import { getAssetBySymbol } from '../../constants/assets';
import Card from '../common/Card';
import Badge from '../common/Badge';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

type SortField = 'symbol' | 'quantity' | 'avgCost' | 'currentPrice' | 'totalValue' | 'gainLoss';
type SortDirection = 'asc' | 'desc';

export default function PositionsList() {
  const positions = usePortfolioStore((state) => state.positions);
  const executeTrade = usePortfolioStore((state) => state.executeTrade);
  const prices = usePriceStore((state) => state.prices);

  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Enrich positions with current prices and calculations
  const enrichedPositions = useMemo(() => {
    return positions.map((position) => {
      const currentPrice = prices[position.symbol]?.price || position.currentPrice;
      const totalValue = position.quantity * currentPrice;
      const gainLoss = totalValue - position.quantity * position.averagePrice;
      const gainLossPercent = (gainLoss / (position.quantity * position.averagePrice)) * 100;
      const asset = getAssetBySymbol(position.symbol);

      return {
        ...position,
        currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
        companyName: asset?.name || position.symbol,
      };
    });
  }, [positions, prices]);

  // Sort positions
  const sortedPositions = useMemo(() => {
    const sorted = [...enrichedPositions];

    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'avgCost':
          aValue = a.averagePrice;
          bValue = b.averagePrice;
          break;
        case 'currentPrice':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'totalValue':
          aValue = a.totalValue;
          bValue = b.totalValue;
          break;
        case 'gainLoss':
          aValue = a.gainLossPercent;
          bValue = b.gainLossPercent;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    });

    return sorted;
  }, [enrichedPositions, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSell = (symbol: string, quantity: number, currentPrice: number) => {
    const confirmed = window.confirm(
      `Sell all ${quantity} shares of ${symbol} at $${currentPrice.toFixed(2)}?`
    );

    if (confirmed) {
      const result = executeTrade({
        symbol,
        side: 'SELL',
        quantity,
        price: currentPrice,
      });

      if (!result.success) {
        alert(`Failed to sell: ${result.error}`);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  if (positions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <InboxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Positions Yet</h3>
          <p className="text-gray-500">
            Start trading to see your positions here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Positions</h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-1">
                  Symbol
                  <SortIcon field="symbol" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center gap-1">
                  Quantity
                  <SortIcon field="quantity" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('avgCost')}
              >
                <div className="flex items-center gap-1">
                  Avg Cost
                  <SortIcon field="avgCost" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center gap-1">
                  Current Price
                  <SortIcon field="currentPrice" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center gap-1">
                  Total Value
                  <SortIcon field="totalValue" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('gainLoss')}
              >
                <div className="flex items-center gap-1">
                  Gain/Loss
                  <SortIcon field="gainLoss" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPositions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {position.symbol}
                    </div>
                    <div className="text-xs text-gray-500">{position.companyName}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.quantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(position.averagePrice)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(position.currentPrice)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(position.totalValue)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(position.gainLoss)}
                    </div>
                    <div
                      className={`text-xs ${
                        position.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {formatPercent(position.gainLossPercent)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() =>
                      handleSell(position.symbol, position.quantity, position.currentPrice)
                    }
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedPositions.map((position) => (
          <div
            key={position.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{position.symbol}</h4>
                <p className="text-sm text-gray-500">{position.companyName}</p>
              </div>
              <Badge variant={position.gainLoss >= 0 ? 'success' : 'danger'} showIcon>
                {formatPercent(position.gainLossPercent)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-900">{position.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Cost</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(position.averagePrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Price</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(position.currentPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(position.totalValue)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Gain/Loss</p>
                <p
                  className={`text-sm font-medium ${
                    position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(position.gainLoss)}
                </p>
              </div>
              <button
                onClick={() =>
                  handleSell(position.symbol, position.quantity, position.currentPrice)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Sell All
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
