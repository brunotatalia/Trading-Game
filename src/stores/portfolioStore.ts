import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Portfolio, Position, Transaction, Order } from '../types';
import { useStockDataStore } from './stockDataStore';

interface PortfolioState extends Portfolio {
  executeTrade: (order: Order) => { success: boolean; message: string };
  updatePositionPrices: () => void;
  getPosition: (symbol: string) => Position | undefined;
  reset: () => void;
}

const INITIAL_CASH = 100000; // $100,000 התחלתי
const TRADING_FEE_PERCENT = 0.001; // 0.1% עמלה

const calculatePositionMetrics = (
  position: Position,
  currentPrice: number
): Position => {
  const totalValue = position.quantity * currentPrice;
  const totalCost = position.quantity * position.averagePrice;
  const profitLoss = totalValue - totalCost;
  const profitLossPercent = (profitLoss / totalCost) * 100;

  return {
    ...position,
    currentPrice,
    totalValue,
    profitLoss,
    profitLossPercent,
  };
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cash: INITIAL_CASH,
      positions: [],
      totalValue: INITIAL_CASH,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      transactions: [],

      executeTrade: (order: Order) => {
        const state = get();
        const stockStore = useStockDataStore.getState();
        const stock = stockStore.getStock(order.symbol);

        if (!stock) {
          return { success: false, message: 'מניה לא נמצאה' };
        }

        const price = order.type === 'MARKET' ? stock.price : order.price!;
        const total = order.quantity * price;
        const fee = total * TRADING_FEE_PERCENT;

        if (order.side === 'BUY') {
          // בדיקת תקציב
          if (state.cash < total + fee) {
            return {
              success: false,
              message: `אין מספיק כסף. נדרש: $${(total + fee).toFixed(
                2
              )}, זמין: $${state.cash.toFixed(2)}`,
            };
          }

          // ביצוע קנייה
          const existingPosition = state.positions.find(
            (p) => p.symbol === order.symbol
          );

          let newPositions: Position[];

          if (existingPosition) {
            // עדכון פוזיציה קיימת
            const totalQuantity = existingPosition.quantity + order.quantity;
            const totalCost =
              existingPosition.quantity * existingPosition.averagePrice +
              total;
            const newAveragePrice = totalCost / totalQuantity;

            newPositions = state.positions.map((p) =>
              p.symbol === order.symbol
                ? calculatePositionMetrics(
                    {
                      ...p,
                      quantity: totalQuantity,
                      averagePrice: newAveragePrice,
                    },
                    price
                  )
                : p
            );
          } else {
            // פוזיציה חדשה
            newPositions = [
              ...state.positions,
              calculatePositionMetrics(
                {
                  symbol: order.symbol,
                  quantity: order.quantity,
                  averagePrice: price,
                  currentPrice: price,
                  totalValue: total,
                  profitLoss: 0,
                  profitLossPercent: 0,
                },
                price
              ),
            ];
          }

          // יצירת טרנזקציה
          const transaction: Transaction = {
            id: Date.now().toString(),
            type: 'BUY',
            symbol: order.symbol,
            quantity: order.quantity,
            price,
            total: total + fee,
            fee,
            timestamp: new Date(),
          };

          set({
            cash: state.cash - total - fee,
            positions: newPositions,
            transactions: [transaction, ...state.transactions],
          });

          // עדכון סה"כ שווי
          get().updatePositionPrices();

          return {
            success: true,
            message: `נקנו ${order.quantity} מניות של ${order.symbol} ב-$${price.toFixed(2)}`,
          };
        } else {
          // SELL
          const position = state.positions.find((p) => p.symbol === order.symbol);

          if (!position) {
            return {
              success: false,
              message: `אין לך מניות של ${order.symbol}`,
            };
          }

          if (position.quantity < order.quantity) {
            return {
              success: false,
              message: `אין מספיק מניות. יש לך: ${position.quantity}, מנסה למכור: ${order.quantity}`,
            };
          }

          // ביצוע מכירה
          let newPositions: Position[];

          if (position.quantity === order.quantity) {
            // מכירת כל הפוזיציה
            newPositions = state.positions.filter(
              (p) => p.symbol !== order.symbol
            );
          } else {
            // מכירה חלקית
            newPositions = state.positions.map((p) =>
              p.symbol === order.symbol
                ? calculatePositionMetrics(
                    {
                      ...p,
                      quantity: p.quantity - order.quantity,
                    },
                    price
                  )
                : p
            );
          }

          // יצירת טרנזקציה
          const transaction: Transaction = {
            id: Date.now().toString(),
            type: 'SELL',
            symbol: order.symbol,
            quantity: order.quantity,
            price,
            total: total - fee,
            fee,
            timestamp: new Date(),
          };

          set({
            cash: state.cash + total - fee,
            positions: newPositions,
            transactions: [transaction, ...state.transactions],
          });

          // עדכון סה"כ שווי
          get().updatePositionPrices();

          return {
            success: true,
            message: `נמכרו ${order.quantity} מניות של ${order.symbol} ב-$${price.toFixed(2)}`,
          };
        }
      },

      updatePositionPrices: () => {
        const stockStore = useStockDataStore.getState();

        set((state) => {
          const updatedPositions = state.positions.map((position) => {
            const stock = stockStore.getStock(position.symbol);
            if (!stock) return position;

            return calculatePositionMetrics(position, stock.price);
          });

          const totalPositionsValue = updatedPositions.reduce(
            (sum, p) => sum + p.totalValue,
            0
          );
          const totalValue = state.cash + totalPositionsValue;
          const totalProfitLoss = totalValue - INITIAL_CASH;
          const totalProfitLossPercent = (totalProfitLoss / INITIAL_CASH) * 100;

          return {
            positions: updatedPositions,
            totalValue,
            totalProfitLoss,
            totalProfitLossPercent,
          };
        });
      },

      getPosition: (symbol: string) => {
        return get().positions.find((p) => p.symbol === symbol);
      },

      reset: () => {
        set({
          cash: INITIAL_CASH,
          positions: [],
          totalValue: INITIAL_CASH,
          totalProfitLoss: 0,
          totalProfitLossPercent: 0,
          transactions: [],
        });
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
