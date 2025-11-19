import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { useRealTimePrice, useMarketState } from '../../hooks/useRealTimePrice';
import {
  formatPrice,
  formatPriceChange,
  formatPercentChange,
} from '../../utils/calculations/priceUtils';

interface PriceDisplayProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  symbol,
  size = 'md',
  showBadge = true,
  className,
}) => {
  const priceData = useRealTimePrice(symbol);
  const { isOpen } = useMarketState();
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  // אנימציית flash כשהמחיר משתנה
  useEffect(() => {
    if (!priceData) return;

    if (priceData.isUp) {
      setFlash('up');
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    } else if (priceData.isDown) {
      setFlash('down');
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [priceData?.price]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!priceData) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const changeSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {/* Price */}
      <div
        className={clsx(
          'font-bold transition-all duration-300',
          sizeClasses[size],
          flash === 'up' && 'text-green-600 scale-110',
          flash === 'down' && 'text-red-600 scale-110',
          !flash && 'text-gray-900'
        )}
      >
        {formatPrice(priceData.price)}
      </div>

      {/* Change */}
      <div className="flex flex-col items-start">
        <div
          className={clsx(
            'flex items-center gap-1 font-semibold',
            changeSizeClasses[size],
            priceData.isUp && 'text-green-600',
            priceData.isDown && 'text-red-600',
            priceData.isFlat && 'text-gray-500'
          )}
        >
          {priceData.isUp && <ArrowUpIcon className="w-3 h-3" />}
          {priceData.isDown && <ArrowDownIcon className="w-3 h-3" />}
          <span>{formatPriceChange(priceData.change)}</span>
        </div>

        <div
          className={clsx(
            'font-medium',
            changeSizeClasses[size],
            priceData.isUp && 'text-green-600',
            priceData.isDown && 'text-red-600',
            priceData.isFlat && 'text-gray-500'
          )}
        >
          {formatPercentChange(priceData.changePercent)}
        </div>
      </div>

      {/* Live Badge */}
      {showBadge && isOpen && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">LIVE</span>
        </div>
      )}

      {/* Closed Badge */}
      {showBadge && !isOpen && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
          <div className="w-2 h-2 bg-gray-500 rounded-full" />
          <span className="text-xs font-semibold text-gray-700">CLOSED</span>
        </div>
      )}
    </div>
  );
};
