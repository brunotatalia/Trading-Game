import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { usePortfolioStore } from '../../stores/portfolioStore';

const navigation = [
  { name: 'דף הבית', href: '/', icon: HomeIcon },
  { name: 'מסחר', href: '/trading', icon: ChartBarIcon },
  { name: 'התיק שלי', href: '/portfolio', icon: BriefcaseIcon },
];

export const Sidebar: React.FC = () => {
  const { cash, totalValue, totalProfitLoss } = usePortfolioStore();
  const reset = usePortfolioStore((state) => state.reset);

  const handleReset = () => {
    if (
      window.confirm(
        'האם אתה בטוח שברצונך לאפס את התיק? כל הנתונים יימחקו!'
      )
    ) {
      reset();
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Trading Game</h1>
        <p className="text-sm text-gray-400 mt-1">משחק מסחר במניות</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Portfolio Summary */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1">כסף זמין</div>
            <div className="text-lg font-bold text-green-400">
              ${cash.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">שווי תיק</div>
            <div className="text-lg font-bold">${totalValue.toFixed(0)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">רווח/הפסד</div>
            <div
              className={clsx(
                'text-lg font-bold',
                totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(0)}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
        >
          <ArrowPathIcon className="w-4 h-4" />
          אפס תיק
        </button>
      </div>
    </div>
  );
};
