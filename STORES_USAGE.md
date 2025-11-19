# Stores Usage Guide

This guide explains how to use the Zustand stores in the Trading Game.

## Portfolio Store

The portfolio store manages cash, positions, and transactions.

### Basic Usage

```typescript
import { usePortfolioStore } from './stores/portfolioStore';

function MyComponent() {
  const cash = usePortfolioStore((state) => state.cash);
  const positions = usePortfolioStore((state) => state.positions);
  const executeTrade = usePortfolioStore((state) => state.executeTrade);

  // Execute a trade
  const handleBuy = () => {
    const result = executeTrade({
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 10,
      price: 150,
    });

    if (result.success) {
      console.log('Trade executed successfully!');
    } else {
      console.error('Trade failed:', result.error);
    }
  };

  return (
    <div>
      <p>Cash: ${cash.toFixed(2)}</p>
      <p>Positions: {positions.length}</p>
      <button onClick={handleBuy}>Buy 10 AAPL</button>
    </div>
  );
}
```

### API Reference

#### State

- `portfolioId: string` - Unique portfolio identifier
- `cash: number` - Available cash ($100,000 initial)
- `positions: Position[]` - Array of current positions
- `transactions: Transaction[]` - Transaction history
- `startingCash: number` - Initial cash amount
- `createdAt: Date` - Portfolio creation date

#### Actions

##### `executeTrade(trade: TradeInput)`

Executes a buy or sell trade.

```typescript
const result = executeTrade({
  symbol: 'AAPL',
  side: 'BUY', // or 'SELL'
  quantity: 10,
  price: 150,
});
```

Returns: `{ success: boolean, error?: string }`

**Validations:**
- Quantity must be positive
- Price must be positive
- For BUY: Must have sufficient cash
- For SELL: Must have sufficient shares

**Commission:** 0.1% on all trades

##### `updatePosition(symbol: string, updates: Partial<Position>)`

Updates a position with new data.

```typescript
updatePosition('AAPL', {
  currentPrice: 155,
});
```

##### `getPosition(symbol: string)`

Gets a position by symbol.

```typescript
const position = getPosition('AAPL');
if (position) {
  console.log('AAPL shares:', position.quantity);
}
```

##### `getTotalValue(prices: Record<string, number>)`

Calculates total portfolio value.

```typescript
const totalValue = getTotalValue({
  AAPL: 155,
  GOOGL: 145,
});
```

##### `reset()`

Resets portfolio to initial state.

```typescript
reset();
```

---

## Price Store

The price store manages real-time price data.

### Basic Usage

```typescript
import { usePriceStore } from './stores/priceStore';

function PriceDisplay() {
  const prices = usePriceStore((state) => state.prices);
  const getPrice = usePriceStore((state) => state.getPrice);
  const startPriceUpdates = usePriceStore((state) => state.startPriceUpdates);

  const aaplPrice = getPrice('AAPL');

  return (
    <div>
      <p>AAPL Price: ${aaplPrice?.toFixed(2)}</p>
      <button onClick={startPriceUpdates}>Start Live Prices</button>
    </div>
  );
}
```

### API Reference

#### State

- `prices: Record<string, PriceData>` - Current prices for all symbols
- `lastUpdate: Date` - Last update timestamp
- `isUpdating: boolean` - Whether auto-updates are active

#### Actions

##### `updatePrices(updates: Record<string, Partial<PriceData>>)`

Updates prices for one or more symbols.

```typescript
updatePrices({
  AAPL: { price: 155, change: 5, changePercent: 3.33 },
});
```

##### `getPrice(symbol: string)`

Gets current price for a symbol.

```typescript
const price = getPrice('AAPL'); // Returns number | undefined
```

##### `startPriceUpdates()`

Starts automatic price updates (every 2 seconds).

```typescript
startPriceUpdates();
```

##### `stopPriceUpdates()`

Stops automatic price updates.

```typescript
stopPriceUpdates();
```

---

## User Store

The user store manages user progression.

### Basic Usage

```typescript
import { useUserStore } from './stores/userStore';

function UserProfile() {
  const { username, level, xp } = useUserStore();
  const addXP = useUserStore((state) => state.addXP);
  const unlockAchievement = useUserStore((state) => state.unlockAchievement);

  return (
    <div>
      <h1>{username}</h1>
      <p>Level {level}</p>
      <p>XP: {xp} / {level * 1000}</p>
      <button onClick={() => addXP(100)}>Add 100 XP</button>
    </div>
  );
}
```

### API Reference

#### State

- `userId: string` - Unique user ID
- `username: string` - User's display name
- `level: number` - Current level (starts at 1)
- `xp: number` - Current experience points
- `achievements: string[]` - Unlocked achievement IDs

#### Actions

##### `addXP(amount: number)`

Adds XP and automatically levels up when threshold reached.

```typescript
addXP(100); // Adds 100 XP
```

**Level Up:** Requires `currentLevel * 1000` XP

##### `unlockAchievement(id: string)`

Unlocks an achievement and awards 100 XP.

```typescript
import { ACHIEVEMENTS } from './stores/userStore';

unlockAchievement(ACHIEVEMENTS.FIRST_TRADE.id);
```

##### `setUsername(username: string)`

Updates the username.

```typescript
setUsername('TraderPro');
```

---

## Custom Hooks

### `usePortfolioValue()`

Combines portfolio and price stores to calculate real-time metrics.

```typescript
import { usePortfolioValue } from './hooks/usePortfolioValue';

function PortfolioSummary() {
  const { value, gainLoss, gainLossPercent, cash, positionCount } = usePortfolioValue();

  return (
    <div>
      <p>Total Value: ${value.toFixed(2)}</p>
      <p>Gain/Loss: ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)</p>
      <p>Cash: ${cash.toFixed(2)}</p>
      <p>Positions: {positionCount}</p>
    </div>
  );
}
```

---

## Testing the Stores

Open browser console and run:

```javascript
// Import the test functions
import { runAllTests } from './stores/__tests__/portfolioStore.test';

// Run all tests
runAllTests();

// Or run individual tests
import { testBuyTrade, testSellTrade } from './stores/__tests__/portfolioStore.test';
testBuyTrade();
testSellTrade();
```

### Manual Testing

```javascript
// Get store instance
import { usePortfolioStore } from './stores/portfolioStore';
const store = usePortfolioStore.getState();

// Test buying
store.executeTrade({
  symbol: 'AAPL',
  side: 'BUY',
  quantity: 10,
  price: 150,
});

console.log('Cash:', store.cash);
console.log('Positions:', store.positions);

// Test selling
store.executeTrade({
  symbol: 'AAPL',
  side: 'SELL',
  quantity: 5,
  price: 160,
});

console.log('Cash after sell:', store.cash);
console.log('Positions after sell:', store.positions);
```

---

## Available Assets

20 stocks are available for trading:

**Technology:**
- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Alphabet)
- META (Meta)
- NVDA (NVIDIA)
- AMD (AMD)

**Finance:**
- JPM (JPMorgan)
- BAC (Bank of America)
- V (Visa)
- MA (Mastercard)

**Healthcare:**
- JNJ (Johnson & Johnson)
- PFE (Pfizer)
- UNH (UnitedHealth)

**Consumer:**
- AMZN (Amazon)
- WMT (Walmart)
- HD (Home Depot)
- NKE (Nike)
- TSLA (Tesla)

**Energy:**
- XOM (Exxon)
- CVX (Chevron)

See `src/constants/assets.ts` for initial prices and details.
