import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { StockSearch } from './StockSearch';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { usePriceStore } from '../../stores/priceStore';
import type { StockInfo } from '../../types/market.types';
import type { OrderSide, OrderType } from '../../types/trading.types';
import { formatCurrency, formatPrice } from '../../utils/formatting/currency';

export function OrderForm() {
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [error, setError] = useState('');

  const executeTrade = usePortfolioStore(s => s.executeTrade);
  const cash = usePortfolioStore(s => s.portfolio.cash);
  const getPrice = usePriceStore(s => s.getPrice);

  const currentPrice = selectedStock ? getPrice(selectedStock.symbol) : 0;
  const qty = parseFloat(quantity) || 0;
  const price = orderType === 'LIMIT' ? (parseFloat(limitPrice) || 0) : currentPrice;
  const total = qty * price;

  const handleSubmit = () => {
    setError('');

    if (!selectedStock) {
      setError('Please select a stock');
      return;
    }

    if (!quantity || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (orderType === 'LIMIT' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      setError('Please enter a valid limit price');
      return;
    }

    const result = executeTrade({
      symbol: selectedStock.symbol,
      side,
      quantity: qty,
      price: orderType === 'LIMIT' ? parseFloat(limitPrice) : undefined,
      type: orderType
    }, currentPrice);

    if (result.success) {
      alert(`${side} order executed successfully!`);
      setQuantity('');
      setLimitPrice('');
      setError('');
    } else {
      setError(result.error || 'Trade failed');
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Place Order</h3>

      <StockSearch selected={selectedStock} onSelect={setSelectedStock} />

      {selectedStock && (
        <div className="my-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Price:</span>
            <span className="text-xl font-bold">${formatPrice(currentPrice)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2 my-4">
        <Button
          variant={side === 'BUY' ? 'success' : 'outline'}
          onClick={() => setSide('BUY')}
          fullWidth
        >
          Buy
        </Button>
        <Button
          variant={side === 'SELL' ? 'danger' : 'outline'}
          onClick={() => setSide('SELL')}
          fullWidth
        >
          Sell
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={orderType === 'MARKET' ? 'primary' : 'outline'}
          onClick={() => setOrderType('MARKET')}
        >
          Market
        </Button>
        <Button
          size="sm"
          variant={orderType === 'LIMIT' ? 'primary' : 'outline'}
          onClick={() => setOrderType('LIMIT')}
        >
          Limit
        </Button>
      </div>

      <Input
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="0"
        min="1"
      />

      {orderType === 'LIMIT' && (
        <Input
          type="number"
          label="Limit Price"
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
        />
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available Cash:</span>
          <span className="font-semibold">{formatCurrency(cash)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <Button
        variant={side === 'BUY' ? 'success' : 'danger'}
        fullWidth
        onClick={handleSubmit}
        disabled={!selectedStock || !quantity}
      >
        {side} {selectedStock?.symbol || 'Stock'}
      </Button>
    </Card>
  );
}
