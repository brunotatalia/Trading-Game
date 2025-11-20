import { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { BlackScholesCalculator } from '../../utils/calculations/blackScholes';
import { formatPrice } from '../../utils/formatting/currency';

export function OptionsCalculator() {
  const [spotPrice, setSpotPrice] = useState('100');
  const [strike, setStrike] = useState('100');
  const [daysToExpiry, setDaysToExpiry] = useState('30');
  const [volatility, setVolatility] = useState('25');
  const [riskFreeRate, setRiskFreeRate] = useState('4.5');

  const params = {
    S: parseFloat(spotPrice) || 0,
    K: parseFloat(strike) || 0,
    T: (parseFloat(daysToExpiry) || 0) / 365,
    r: (parseFloat(riskFreeRate) || 0) / 100,
    sigma: (parseFloat(volatility) || 0) / 100
  };

  const callPrice = params.S > 0 ? BlackScholesCalculator.callPrice(params) : 0;
  const putPrice = params.S > 0 ? BlackScholesCalculator.putPrice(params) : 0;

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Options Calculator</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label="Spot Price ($)"
          value={spotPrice}
          onChange={(e) => setSpotPrice(e.target.value)}
        />
        <Input
          type="number"
          label="Strike Price ($)"
          value={strike}
          onChange={(e) => setStrike(e.target.value)}
        />
        <Input
          type="number"
          label="Days to Expiry"
          value={daysToExpiry}
          onChange={(e) => setDaysToExpiry(e.target.value)}
        />
        <Input
          type="number"
          label="Volatility (%)"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
        />
        <Input
          type="number"
          label="Risk-Free Rate (%)"
          value={riskFreeRate}
          onChange={(e) => setRiskFreeRate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Call Price</div>
          <div className="text-2xl font-bold text-green-600">
            ${formatPrice(callPrice)}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Put Price</div>
          <div className="text-2xl font-bold text-red-600">
            ${formatPrice(putPrice)}
          </div>
        </div>
      </div>
    </Card>
  );
}
