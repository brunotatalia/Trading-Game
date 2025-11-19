import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { StockSearch } from './StockSearch';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useStockDataStore } from '../../stores/stockDataStore';
import { useToast } from '../../hooks/useToast';
import { validateOrder } from '../../utils/validation/orderValidation';
import type { Order, OrderType, OrderSide } from '../../types';

export const OrderForm: React.FC = () => {
  const toast = useToast();
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const [symbol, setSymbol] = useState<string | null>(null);
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cash = usePortfolioStore((state) => state.cash);
  const getPosition = usePortfolioStore((state) => state.getPosition);
  const executeTrade = usePortfolioStore((state) => state.executeTrade);
  const getStock = useStockDataStore((state) => state.getStock);

  const stock = symbol ? getStock(symbol) : null;
  const position = symbol ? getPosition(symbol) : undefined;

  // Auto-focus quantity input כשבוחרים מניה
  useEffect(() => {
    if (symbol && quantityInputRef.current) {
      quantityInputRef.current.focus();
    }
  }, [symbol]);

  // חישוב עלות/תמורה כוללת
  const calculateTotal = () => {
    if (!stock || !quantity) return null;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) return null;

    const price =
      orderType === 'MARKET'
        ? stock.price
        : parseFloat(limitPrice) || stock.price;

    const subtotal = qty * price;
    const fee = subtotal * 0.001; // 0.1% fee

    if (side === 'BUY') {
      return {
        subtotal,
        fee,
        total: subtotal + fee,
      };
    } else {
      return {
        subtotal,
        fee,
        total: subtotal - fee,
      };
    }
  };

  const total = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol || !stock) {
      toast.error('יש לבחור מניה');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty)) {
      toast.error('יש להזין כמות חוקית');
      return;
    }

    const order: Order = {
      symbol,
      side,
      type: orderType,
      quantity: qty,
      price: orderType === 'LIMIT' ? parseFloat(limitPrice) : undefined,
    };

    // Validation
    const validation = validateOrder(order, cash, position, stock.price);

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    // Execute trade
    setIsSubmitting(true);

    setTimeout(() => {
      const result = executeTrade(order);

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setQuantity('');
        setLimitPrice('');
      } else {
        toast.error(result.message);
      }

      setIsSubmitting(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ביצוע פקודת מסחר</h2>

      <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
        {/* Stock Selection */}
        <div className="mb-6">
          <StockSearch
            value={symbol}
            onChange={setSymbol}
            label="בחר מניה"
          />
        </div>

        {/* Buy/Sell Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג פעולה
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={clsx(
                'py-3 px-4 rounded-lg font-semibold transition-all',
                side === 'BUY'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              קנה (BUY)
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={clsx(
                'py-3 px-4 rounded-lg font-semibold transition-all',
                side === 'SELL'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              מכור (SELL)
            </button>
          </div>
        </div>

        {/* Order Type Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג פקודה
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={clsx(
                'py-2.5 px-4 rounded-lg font-medium transition-all',
                orderType === 'MARKET'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              שוק (Market)
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={clsx(
                'py-2.5 px-4 rounded-lg font-medium transition-all',
                orderType === 'LIMIT'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              מוגבל (Limit)
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <Input
            ref={quantityInputRef}
            type="number"
            label="כמות מניות"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            min="1"
            step="1"
          />
        </div>

        {/* Limit Price */}
        {orderType === 'LIMIT' && (
          <div className="mb-6">
            <Input
              type="currency"
              label="מחיר מוגבל"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
        )}

        {/* Current Info */}
        {stock && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">מחיר נוכחי:</span>
              <span className="text-lg font-semibold">
                ${stock.price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">כסף זמין:</span>
              <span className="text-lg font-semibold text-green-600">
                ${cash.toFixed(2)}
              </span>
            </div>

            {side === 'SELL' && position && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">מניות בבעלותך:</span>
                <span className="text-lg font-semibold text-blue-600">
                  {position.quantity}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Calculation */}
        {total && (
          <div className="mb-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">סכום ביניים:</span>
              <span className="font-medium">${total.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">עמלה (0.1%):</span>
              <span className="font-medium text-red-600">
                ${total.fee.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-primary-300 my-2" />

            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">
                {side === 'BUY' ? 'סה"כ לתשלום:' : 'סה"כ לקבלה:'}
              </span>
              <span className="text-xl font-bold text-primary-700">
                ${total.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant={side === 'BUY' ? 'success' : 'danger'}
          size="lg"
          className="w-full"
          disabled={!symbol || !quantity || isSubmitting}
          loading={isSubmitting}
        >
          {side === 'BUY' ? `קנה ${symbol || ''}` : `מכור ${symbol || ''}`}
        </Button>
      </form>
    </div>
  );
};
