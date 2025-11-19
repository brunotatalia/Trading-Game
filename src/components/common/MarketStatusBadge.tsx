import React from 'react';
import clsx from 'clsx';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { useMarketState } from '../../hooks/useRealTimePrice';

export const MarketStatusBadge: React.FC = () => {
  const { regime, vix, isOpen } = useMarketState();

  const regimeConfig = {
    bull: {
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Bull Market',
    },
    bear: {
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Bear Market',
    },
    sideways: {
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Sideways',
    },
  };

  const config = regimeConfig[regime];
  const Icon = config.icon;

  // VIX color based on level
  const vixColor =
    vix < 15
      ? 'text-green-600'
      : vix < 25
      ? 'text-yellow-600'
      : 'text-red-600';

  return (
    <div className="flex items-center gap-4">
      {/* Market Regime */}
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          config.bgColor
        )}
      >
        <Icon className={clsx('w-5 h-5', config.color)} />
        <span className={clsx('text-sm font-semibold', config.color)}>
          {config.label}
        </span>
      </div>

      {/* VIX */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
        <span className="text-sm font-medium text-gray-600">VIX:</span>
        <span className={clsx('text-sm font-bold', vixColor)}>
          {vix.toFixed(2)}
        </span>
      </div>

      {/* Market Status */}
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          isOpen ? 'bg-green-100' : 'bg-gray-100'
        )}
      >
        <div
          className={clsx(
            'w-2 h-2 rounded-full',
            isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          )}
        />
        <span
          className={clsx(
            'text-sm font-semibold',
            isOpen ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {isOpen ? 'Market Open' : 'Market Closed'}
        </span>
      </div>
    </div>
  );
};
