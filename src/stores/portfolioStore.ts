import { create } from 'zustand';
import type { Portfolio, Position } from '../types/portfolio.types';
import type { Order, Trade, TradeResult } from '../types/trading.types';
import { STARTING_CASH, TRADING_FEE_PERCENT } from '../constants/config';
import { v4 as uuidv4 } from 'uuid';

interface PortfolioState {
  portfolio: Portfolio;
  executeTrade: (order: Order, currentPrice: number) => TradeResult;
  getPosition: (symbol: string) => Position | undefined;
  getTotalValue: (prices: Record<string, number>) => number;
  reset: () => void;
}

const createInitialPortfolio = (): Portfolio => ({
  id: uuidv4(),
  cash: STARTING_CASH,
  positions: [],
  transactions: [],
  startingCash: STARTING_CASH,
  createdAt: new Date()
});

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: createInitialPortfolio(),

  executeTrade: (order, currentPrice) => {
    const { portfolio } = get();
    const price = order.type === 'LIMIT' && order.price ? order.price : currentPrice;
    const total = price * order.quantity;
    const fee = total * TRADING_FEE_PERCENT;
    const totalWithFee = total + fee;

    // Validate BUY
    if (order.side === 'BUY') {
      if (portfolio.cash < totalWithFee) {
        return { success: false, error: 'Insufficient funds' };
      }

      // Execute BUY
      const existingPos = portfolio.positions.find(p => p.symbol === order.symbol);
      const newPositions = [...portfolio.positions];

      if (existingPos) {
        const totalQuantity = existingPos.quantity + order.quantity;
        const totalCost = (existingPos.averageCost * existingPos.quantity) + total;
        existingPos.quantity = totalQuantity;
        existingPos.averageCost = totalCost / totalQuantity;
      } else {
        newPositions.push({
          symbol: order.symbol,
          quantity: order.quantity,
          averageCost: price,
          currentPrice: price
        });
      }

      const trade: Trade = {
        id: uuidv4(),
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        price,
        timestamp: new Date(),
        fee,
        total: totalWithFee
      };

      set({
        portfolio: {
          ...portfolio,
          cash: portfolio.cash - totalWithFee,
          positions: newPositions,
          transactions: [...portfolio.transactions, trade]
        }
      });

      return { success: true, trade };
    }

    // Validate SELL
    const position = portfolio.positions.find(p => p.symbol === order.symbol);
    if (!position || position.quantity < order.quantity) {
      return { success: false, error: 'Insufficient shares' };
    }

    // Execute SELL
    const newPositions = portfolio.positions
      .map(p => {
        if (p.symbol === order.symbol) {
          return { ...p, quantity: p.quantity - order.quantity };
        }
        return p;
      })
      .filter(p => p.quantity > 0);

    const trade: Trade = {
      id: uuidv4(),
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      price,
      timestamp: new Date(),
      fee,
      total: total - fee
    };

    set({
      portfolio: {
        ...portfolio,
        cash: portfolio.cash + (total - fee),
        positions: newPositions,
        transactions: [...portfolio.transactions, trade]
      }
    });

    return { success: true, trade };
  },

  getPosition: (symbol) => {
    return get().portfolio.positions.find(p => p.symbol === symbol);
  },

  getTotalValue: (prices) => {
    const { portfolio } = get();
    const positionsValue = portfolio.positions.reduce((sum, pos) => {
      const price = prices[pos.symbol] || pos.currentPrice;
      return sum + (pos.quantity * price);
    }, 0);
    return portfolio.cash + positionsValue;
  },

  reset: () => {
    set({ portfolio: createInitialPortfolio() });
  }
}));
