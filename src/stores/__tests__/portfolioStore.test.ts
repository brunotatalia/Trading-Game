/**
 * Basic tests for portfolioStore
 * These tests validate core portfolio functionality
 */

import { usePortfolioStore } from '../portfolioStore';

/**
 * Test: Create new portfolio
 */
export function testCreatePortfolio() {
  const store = usePortfolioStore.getState();

  console.log('Test: Create new portfolio');
  console.log('Initial cash:', store.cash);
  console.log('Initial positions:', store.positions.length);
  console.log('Expected cash: $100,000');
  console.log('Expected positions: 0');

  const passed = store.cash === 100000 && store.positions.length === 0;
  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Test: Execute buy trade
 */
export function testBuyTrade() {
  const store = usePortfolioStore.getState();
  store.reset(); // Reset to initial state

  console.log('Test: Execute buy trade');
  const initialCash = store.cash;

  const result = store.executeTrade({
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 10,
    price: 150,
  });

  console.log('Trade result:', result);
  console.log('Initial cash:', initialCash);
  console.log('Final cash:', store.cash);
  console.log('Positions:', store.positions.length);

  const expectedCost = 10 * 150 * 1.001; // Including 0.1% commission
  const expectedCash = initialCash - expectedCost;

  const passed =
    result.success &&
    store.positions.length === 1 &&
    store.positions[0].symbol === 'AAPL' &&
    store.positions[0].quantity === 10 &&
    Math.abs(store.cash - expectedCash) < 0.01;

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Test: Execute sell trade
 */
export function testSellTrade() {
  const store = usePortfolioStore.getState();
  store.reset();

  console.log('Test: Execute sell trade');

  // First buy some shares
  store.executeTrade({
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 20,
    price: 150,
  });

  const cashAfterBuy = store.cash;

  // Then sell some
  const result = store.executeTrade({
    symbol: 'AAPL',
    side: 'SELL',
    quantity: 10,
    price: 160,
  });

  console.log('Sell result:', result);
  console.log('Cash after buy:', cashAfterBuy);
  console.log('Cash after sell:', store.cash);
  console.log('Remaining position quantity:', store.positions[0]?.quantity);

  const expectedProceeds = 10 * 160 * 0.999; // Minus 0.1% commission
  const expectedCash = cashAfterBuy + expectedProceeds;

  const passed =
    result.success &&
    store.positions.length === 1 &&
    store.positions[0].quantity === 10 &&
    Math.abs(store.cash - expectedCash) < 0.01;

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Test: Calculate portfolio value
 */
export function testCalculateValue() {
  const store = usePortfolioStore.getState();
  store.reset();

  console.log('Test: Calculate portfolio value');

  // Buy some shares
  store.executeTrade({
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 10,
    price: 150,
  });

  store.executeTrade({
    symbol: 'GOOGL',
    side: 'BUY',
    quantity: 5,
    price: 140,
  });

  const prices = {
    AAPL: 160,
    GOOGL: 145,
  };

  const totalValue = store.getTotalValue(prices);

  console.log('Cash:', store.cash);
  console.log('Positions:');
  console.log('  - AAPL: 10 shares @ $160 = $1,600');
  console.log('  - GOOGL: 5 shares @ $145 = $725');
  console.log('Total value:', totalValue);

  const expectedStockValue = 10 * 160 + 5 * 145; // 1600 + 725 = 2325
  const expectedTotal = store.cash + expectedStockValue;

  const passed = Math.abs(totalValue - expectedTotal) < 0.01;

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Test: Insufficient funds
 */
export function testInsufficientFunds() {
  const store = usePortfolioStore.getState();
  store.reset();

  console.log('Test: Insufficient funds');

  const result = store.executeTrade({
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 10000,
    price: 150,
  });

  console.log('Trade result:', result);

  const passed = !result.success && result.error?.includes('Insufficient funds');

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Test: Sell without position
 */
export function testSellWithoutPosition() {
  const store = usePortfolioStore.getState();
  store.reset();

  console.log('Test: Sell without position');

  const result = store.executeTrade({
    symbol: 'AAPL',
    side: 'SELL',
    quantity: 10,
    price: 150,
  });

  console.log('Trade result:', result);

  const passed = !result.success && result.error?.includes('No position found');

  console.log(passed ? '✅ PASSED' : '❌ FAILED');
  console.log('---');

  return passed;
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('=== Portfolio Store Tests ===\n');

  const results = [
    testCreatePortfolio(),
    testBuyTrade(),
    testSellTrade(),
    testCalculateValue(),
    testInsufficientFunds(),
    testSellWithoutPosition(),
  ];

  const passed = results.filter((r) => r).length;
  const total = results.length;

  console.log('\n=== Test Summary ===');
  console.log(`Passed: ${passed}/${total}`);
  console.log(passed === total ? '✅ All tests passed!' : '❌ Some tests failed');

  return passed === total;
}
