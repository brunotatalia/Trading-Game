import { useState } from 'react';
import { OrderForm } from '../components/trading/OrderForm';
import { PriceChart } from '../components/charts/PriceChart';

export function Trading() {
  const [selectedSymbol] = useState('AAPL');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <OrderForm />
      </div>
      <div>
        <PriceChart symbol={selectedSymbol} />
      </div>
    </div>
  );
}
