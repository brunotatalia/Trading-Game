import { useMemo } from 'react';
import { useStockDataStore } from '../stores/stockDataStore';

interface RealTimePriceData {
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  isDown: boolean;
  isFlat: boolean;
}

/**
 * Hook לקבלת מחיר בזמן אמת עבור מניה
 * מתעדכן אוטומטית כשהמחירים משתנים
 */
export function useRealTimePrice(symbol: string): RealTimePriceData | null {
  const stock = useStockDataStore((state) =>
    state.stocks.find((s) => s.symbol === symbol)
  );

  return useMemo(() => {
    if (!stock) return null;

    const isUp = stock.change > 0;
    const isDown = stock.change < 0;
    const isFlat = stock.change === 0;

    return {
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      isUp,
      isDown,
      isFlat,
    };
  }, [stock]);
}

/**
 * Hook לקבלת מצב השוק
 */
export function useMarketState() {
  const marketRegime = useStockDataStore((state) => state.marketRegime);
  const marketStatus = useStockDataStore((state) => state.marketStatus);
  const vix = useStockDataStore((state) => state.vix);

  return {
    regime: marketRegime,
    status: marketStatus,
    vix,
    isOpen: marketStatus === 'open',
    isClosed: marketStatus === 'closed',
  };
}

/**
 * Hook לקבלת כל המניות בזמן אמת
 */
export function useRealTimeStocks() {
  return useStockDataStore((state) => state.stocks);
}

/**
 * Hook לקבלת היסטוריית מחירים
 */
export function usePriceHistory(symbol: string, days: number = 30) {
  const getPriceHistory = useStockDataStore((state) => state.getPriceHistory);

  return useMemo(() => {
    return getPriceHistory(symbol, days);
  }, [symbol, days, getPriceHistory]);
}
