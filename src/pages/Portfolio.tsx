import React from 'react';
import clsx from 'clsx';
import { usePortfolioStore } from '../stores/portfolioStore';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

export const Portfolio: React.FC = () => {
  const {
    cash,
    positions,
    totalValue,
    totalProfitLoss,
    totalProfitLossPercent,
    transactions,
  } = usePortfolioStore();

  const isProfit = totalProfitLoss >= 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">התיק שלי</h1>
        <p className="text-gray-600">סקירה של ההשקעות והעסקאות שלך</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">סה"כ שווי</div>
          <div className="text-3xl font-bold text-gray-900">
            ${totalValue.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">כסף זמין</div>
          <div className="text-3xl font-bold text-green-600">
            ${cash.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">רווח/הפסד</div>
          <div
            className={clsx(
              'text-3xl font-bold flex items-center gap-2',
              isProfit ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isProfit ? (
              <ArrowTrendingUpIcon className="w-8 h-8" />
            ) : (
              <ArrowTrendingDownIcon className="w-8 h-8" />
            )}
            <div>
              {isProfit ? '+' : ''}${totalProfitLoss.toFixed(2)}
              <span className="text-lg mr-2">
                ({isProfit ? '+' : ''}
                {totalProfitLossPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">פוזיציות פתוחות</h2>

        {positions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            אין פוזיציות פתוחות. התחל למסחר כדי לראות את ההשקעות שלך כאן!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    סימול
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    כמות
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    מחיר ממוצע
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    מחיר נוכחי
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    שווי כולל
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    רווח/הפסד
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const isProfitable = position.profitLoss >= 0;
                  return (
                    <tr key={position.symbol} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-semibold">
                        {position.symbol}
                      </td>
                      <td className="py-3 px-4">{position.quantity}</td>
                      <td className="py-3 px-4">
                        ${position.averagePrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        ${position.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${position.totalValue.toFixed(2)}
                      </td>
                      <td
                        className={clsx(
                          'py-3 px-4 font-semibold',
                          isProfitable ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {isProfitable ? '+' : ''}${position.profitLoss.toFixed(2)}
                        <span className="text-sm mr-1">
                          ({isProfitable ? '+' : ''}
                          {position.profitLossPercent.toFixed(2)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">עסקאות אחרונות</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            אין עסקאות עדיין
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    תאריך
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    סוג
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    סימול
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    כמות
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    מחיר
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    עמלה
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    סה"כ
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleString('he-IL')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          transaction.type === 'BUY'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {transaction.type === 'BUY' ? 'קנייה' : 'מכירה'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {transaction.symbol}
                    </td>
                    <td className="py-3 px-4">{transaction.quantity}</td>
                    <td className="py-3 px-4">${transaction.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-red-600">
                      ${transaction.fee.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${transaction.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
