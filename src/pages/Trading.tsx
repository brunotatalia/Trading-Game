import React, { useEffect } from 'react';
import { OrderForm } from '../components/trading/OrderForm';
import { useStockDataStore } from '../stores/stockDataStore';
import { usePortfolioStore } from '../stores/portfolioStore';

export const Trading: React.FC = () => {
  const updatePrices = useStockDataStore((state) => state.updatePrices);
  const updatePositionPrices = usePortfolioStore(
    (state) => state.updatePositionPrices
  );

  // עדכון מחירים כל 5 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
      updatePositionPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, [updatePrices, updatePositionPrices]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">מסחר במניות</h1>
        <p className="text-gray-600">
          קנה ומכור מניות בזמן אמת
        </p>
      </div>

      <OrderForm />

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">טיפים למסחר:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>השתמש במקש Enter לביצוע פקודה מהירה</li>
          <li>עמלת מסחר היא 0.1% מסכום העסקה</li>
          <li>Market Order מבוצע במחיר השוק הנוכחי</li>
          <li>Limit Order מאפשר לך לקבוע מחיר רצוי</li>
        </ul>
      </div>
    </div>
  );
};
