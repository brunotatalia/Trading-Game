import { create } from 'zustand';
import { dinero, add, subtract, toDecimal } from 'dinero.js';
import { USD } from '@dinero.js/currencies';
import type { Position } from '../types/portfolio.types';
import type { TradeInput, Transaction } from '../types/trading.types';

interface PortfolioState {
  portfolioId: string;
  cash: number;
  positions: Position[];
  transactions: Transaction[];
  startingCash: number;
  createdAt: Date;
}

interface PortfolioActions {
  executeTrade: (trade: TradeInput) => { success: boolean; error?: string };
  updatePosition: (symbol: string, updates: Partial<Position>) => void;
  getPosition: (symbol: string) => Position | undefined;
  getTotalValue: (prices: Record<string, number>) => number;
  reset: () => void;
}

type PortfolioStore = PortfolioState & PortfolioActions;

const INITIAL_CASH = 100000;
const COMMISSION_RATE = 0.001; // 0.1% commission

/**
 * Creates a Dinero object from a dollar amount
 */
const toDinero = (amount: number) => {
  return dinero({ amount: Math.round(amount * 100), currency: USD });
};

/**
 * Converts Dinero object to number
 */
const fromDinero = (d: ReturnType<typeof dinero>) => {
  return parseFloat(toDecimal(d));
};

/**
 * Generates a unique ID
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolioId: generateId(),
  cash: INITIAL_CASH,
  positions: [],
  transactions: [],
  startingCash: INITIAL_CASH,
  createdAt: new Date(),

  /**
   * Executes a trade (buy or sell)
   * Validates the trade, updates cash and positions, and records the transaction
   */
  executeTrade: (trade: TradeInput) => {
    const { symbol, side, quantity, price } = trade;

    // Validation
    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be positive' };
    }

    if (price <= 0) {
      return { success: false, error: 'Price must be positive' };
    }

    const state = get();
    const totalValue = quantity * price;
    const commission = totalValue * COMMISSION_RATE;
    const totalCost = totalValue + commission;

    if (side === 'BUY') {
      // Check if we have enough cash
      if (state.cash < totalCost) {
        return {
          success: false,
          error: `Insufficient funds. Required: $${totalCost.toFixed(2)}, Available: $${state.cash.toFixed(2)}`,
        };
      }

      // Deduct cash
      const cashDinero = toDinero(state.cash);
      const costDinero = toDinero(totalCost);
      const newCash = fromDinero(subtract(cashDinero, costDinero));

      // Update or create position
      const existingPosition = state.positions.find((p) => p.symbol === symbol);

      let newPositions: Position[];
      if (existingPosition) {
        // Update existing position
        const totalQuantity = existingPosition.quantity + quantity;
        const totalInvested =
          existingPosition.averagePrice * existingPosition.quantity + totalValue;
        const newAveragePrice = totalInvested / totalQuantity;

        newPositions = state.positions.map((p) =>
          p.symbol === symbol
            ? {
                ...p,
                quantity: totalQuantity,
                averagePrice: newAveragePrice,
                currentPrice: price,
                totalValue: totalQuantity * price,
                unrealizedPnL: totalQuantity * (price - newAveragePrice),
                unrealizedPnLPercent:
                  ((price - newAveragePrice) / newAveragePrice) * 100,
                updatedAt: new Date(),
              }
            : p
        );
      } else {
        // Create new position
        const newPosition: Position = {
          id: generateId(),
          symbol,
          asset: {
            symbol,
            name: symbol, // Will be updated later with real name
            type: 'STOCK',
            currentPrice: price,
            lastUpdated: new Date(),
          },
          quantity,
          averagePrice: price,
          currentPrice: price,
          totalValue: totalValue,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          openedAt: new Date(),
          updatedAt: new Date(),
        };
        newPositions = [...state.positions, newPosition];
      }

      // Record transaction
      const transaction: Transaction = {
        id: generateId(),
        type: 'BUY',
        symbol,
        quantity,
        price,
        amount: -totalCost,
        balance: newCash,
        timestamp: new Date(),
        description: `Bought ${quantity} shares of ${symbol} at $${price.toFixed(2)} (Commission: $${commission.toFixed(2)})`,
      };

      set({
        cash: newCash,
        positions: newPositions,
        transactions: [...state.transactions, transaction],
      });

      return { success: true };
    } else {
      // SELL
      const position = state.positions.find((p) => p.symbol === symbol);

      if (!position) {
        return { success: false, error: `No position found for ${symbol}` };
      }

      if (position.quantity < quantity) {
        return {
          success: false,
          error: `Insufficient shares. Available: ${position.quantity}, Requested: ${quantity}`,
        };
      }

      // Add cash from sale
      const cashDinero = toDinero(state.cash);
      const proceedsDinero = toDinero(totalValue - commission);
      const newCash = fromDinero(add(cashDinero, proceedsDinero));

      // Update or remove position
      let newPositions: Position[];
      if (position.quantity === quantity) {
        // Remove position entirely
        newPositions = state.positions.filter((p) => p.symbol !== symbol);
      } else {
        // Reduce position
        newPositions = state.positions.map((p) =>
          p.symbol === symbol
            ? {
                ...p,
                quantity: p.quantity - quantity,
                currentPrice: price,
                totalValue: (p.quantity - quantity) * price,
                unrealizedPnL: (p.quantity - quantity) * (price - p.averagePrice),
                unrealizedPnLPercent:
                  ((price - p.averagePrice) / p.averagePrice) * 100,
                updatedAt: new Date(),
              }
            : p
        );
      }

      // Record transaction
      const transaction: Transaction = {
        id: generateId(),
        type: 'SELL',
        symbol,
        quantity,
        price,
        amount: totalValue - commission,
        balance: newCash,
        timestamp: new Date(),
        description: `Sold ${quantity} shares of ${symbol} at $${price.toFixed(2)} (Commission: $${commission.toFixed(2)})`,
      };

      set({
        cash: newCash,
        positions: newPositions,
        transactions: [...state.transactions, transaction],
      });

      return { success: true };
    }
  },

  /**
   * Updates a position with partial data
   */
  updatePosition: (symbol: string, updates: Partial<Position>) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.symbol === symbol ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    }));
  },

  /**
   * Retrieves a position by symbol
   */
  getPosition: (symbol: string) => {
    return get().positions.find((p) => p.symbol === symbol);
  },

  /**
   * Calculates total portfolio value including cash and all positions
   */
  getTotalValue: (prices: Record<string, number>) => {
    const state = get();
    let totalValue = state.cash;

    for (const position of state.positions) {
      const currentPrice = prices[position.symbol] || position.currentPrice;
      totalValue += position.quantity * currentPrice;
    }

    return totalValue;
  },

  /**
   * Resets the portfolio to initial state
   */
  reset: () => {
    set({
      portfolioId: generateId(),
      cash: INITIAL_CASH,
      positions: [],
      transactions: [],
      startingCash: INITIAL_CASH,
      createdAt: new Date(),
    });
  },
}));
