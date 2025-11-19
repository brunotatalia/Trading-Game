import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceStore } from '../stores/priceStore';
import { AVAILABLE_ASSETS } from '../constants/assets';

/**
 * Initializes a mock portfolio with sample positions for demo purposes
 * This is useful for testing and demonstration
 */
export function initializeMockPortfolio() {
  const portfolioStore = usePortfolioStore.getState();
  const priceStore = usePriceStore.getState();

  // Get current prices
  const prices = priceStore.prices;

  // Sample positions to create
  const mockTrades = [
    { symbol: 'AAPL', quantity: 15, price: prices['AAPL']?.price || 178.72 },
    { symbol: 'GOOGL', quantity: 8, price: prices['GOOGL']?.price || 141.8 },
    { symbol: 'MSFT', quantity: 10, price: prices['MSFT']?.price || 378.91 },
    { symbol: 'NVDA', quantity: 5, price: prices['NVDA']?.price || 495.22 },
    { symbol: 'TSLA', quantity: 12, price: prices['TSLA']?.price || 242.84 },
  ];

  // Execute mock trades
  mockTrades.forEach((trade) => {
    // Use a slightly lower price than current to show some profit
    const purchasePrice = trade.price * 0.95; // 5% below current price
    portfolioStore.executeTrade({
      symbol: trade.symbol,
      side: 'BUY',
      quantity: trade.quantity,
      price: purchasePrice,
    });
  });

  console.log('Mock portfolio initialized with sample positions');
}

/**
 * Resets the portfolio to initial state
 */
export function resetPortfolio() {
  const portfolioStore = usePortfolioStore.getState();
  portfolioStore.reset();
  console.log('Portfolio reset to initial state');
}

/**
 * Generates random trades for stress testing
 */
export function generateRandomTrades(count: number = 10) {
  const portfolioStore = usePortfolioStore.getState();
  const priceStore = usePriceStore.getState();

  for (let i = 0; i < count; i++) {
    // Pick random asset
    const asset = AVAILABLE_ASSETS[Math.floor(Math.random() * AVAILABLE_ASSETS.length)];
    const currentPrice = priceStore.prices[asset.symbol]?.price || asset.initialPrice;

    // Random buy or sell
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';

    // Random quantity (1-20)
    const quantity = Math.floor(Math.random() * 20) + 1;

    // Random price variation (±10%)
    const priceVariation = 0.9 + Math.random() * 0.2;
    const price = currentPrice * priceVariation;

    const result = portfolioStore.executeTrade({
      symbol: asset.symbol,
      side,
      quantity,
      price,
    });

    if (!result.success) {
      console.log(`Trade ${i + 1} failed:`, result.error);
    }
  }

  console.log(`Generated ${count} random trades`);
}
