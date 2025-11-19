import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useStockDataStore } from '../../stores/stockDataStore';
import type { Stock } from '../../types';

interface StockSearchProps {
  value: string | null;
  onChange: (symbol: string | null) => void;
  label?: string;
  error?: string;
}

const RECENT_SEARCHES_KEY = 'recent-stock-searches';
const MAX_RECENT = 3;

export const StockSearch: React.FC<StockSearchProps> = ({
  value,
  onChange,
  label,
  error,
}) => {
  const stocks = useStockDataStore((state) => state.stocks);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // טעינת חיפושים אחרונים
  useEffect(() => {
    const recent = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // שמירת חיפוש אחרון
  const saveRecentSearch = (symbol: string) => {
    const updated = [
      symbol,
      ...recentSearches.filter((s) => s !== symbol),
    ].slice(0, MAX_RECENT);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleChange = (stock: Stock | null) => {
    if (stock) {
      onChange(stock.symbol);
      saveRecentSearch(stock.symbol);
    } else {
      onChange(null);
    }
  };

  const filteredStocks = query === ''
    ? stocks
    : stocks.filter((stock) => {
        const searchTerm = query.toLowerCase();
        return (
          stock.symbol.toLowerCase().includes(searchTerm) ||
          stock.name.toLowerCase().includes(searchTerm)
        );
      });

  const selectedStock = stocks.find((s) => s.symbol === value) || null;

  const recentStocks = recentSearches
    .map((symbol) => stocks.find((s) => s.symbol === symbol))
    .filter(Boolean) as Stock[];

  const showRecent = query === '' && recentStocks.length > 0;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Combobox value={selectedStock} onChange={handleChange}>
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              className={clsx(
                'w-full py-2.5 pr-10 pl-4 rounded-lg border transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              )}
              displayValue={(stock: Stock | null) =>
                stock ? `${stock.symbol} - ${stock.name}` : ''
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder="חפש מניה לפי סימול או שם..."
            />

            <Combobox.Button className="absolute left-0 top-0 h-full px-3 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </Combobox.Button>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Combobox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 overflow-auto border border-gray-200">
            {showRecent && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  חיפושים אחרונים
                </div>
                {recentStocks.map((stock) => (
                  <Combobox.Option
                    key={stock.symbol}
                    value={stock}
                    className={({ active }) =>
                      clsx(
                        'cursor-pointer select-none py-2 px-4',
                        active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className="text-gray-500 mr-2">{stock.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ${stock.price.toFixed(2)}
                      </span>
                    </div>
                  </Combobox.Option>
                ))}
                <div className="border-t border-gray-200 my-1" />
              </>
            )}

            {filteredStocks.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                לא נמצאו מניות
              </div>
            ) : (
              filteredStocks.map((stock) => (
                <Combobox.Option
                  key={stock.symbol}
                  value={stock}
                  className={({ active }) =>
                    clsx(
                      'cursor-pointer select-none py-2 px-4',
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{stock.symbol}</span>
                      <span className="text-gray-500 mr-2">{stock.name}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">${stock.price.toFixed(2)}</div>
                      <div
                        className={clsx(
                          'text-xs',
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {stock.change >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
