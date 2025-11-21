import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { STOCKS } from '../../constants/stocks';
import type { StockInfo } from '../../types/market.types';

interface StockSearchProps {
  onSelect: (stock: StockInfo) => void;
  selected: StockInfo | null;
}

export function StockSearch({ onSelect, selected }: StockSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = query === ''
    ? STOCKS
    : STOCKS.filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleChange = (value: StockInfo | null) => {
    if (value) {
      onSelect(value);
    }
  };

  return (
    <Combobox value={selected} onChange={handleChange}>
      <div className="relative">
        <Combobox.Label className="block text-sm font-medium text-gray-700 mb-2">
          Select Stock
        </Combobox.Label>
        <Combobox.Input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          displayValue={(stock: StockInfo) => stock ? `${stock.symbol} - ${stock.name}` : ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks..."
        />
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg">
            {filtered.map((stock) => (
              <Combobox.Option
                key={stock.symbol}
                value={stock}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? 'bg-primary-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{stock.symbol}</span>
                  <span className="text-sm">{stock.name}</span>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
