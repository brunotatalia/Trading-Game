# Dashboard Guide

A complete guide to the Trading Game dashboard and its components.

## Overview

The dashboard is the main interface for viewing and managing your portfolio. It provides real-time updates on your positions, performance, and statistics.

## Components

### 1. Portfolio Summary

The Portfolio Summary displays the most important metrics at a glance.

**Main Display:**
- **Total Portfolio Value** - Large central display showing your total assets
- **Gain/Loss Badge** - Color-coded indicator showing profit (green) or loss (red)

**Metrics Grid (4 cards):**

1. **Cash Available**
   - Shows your current cash balance
   - Displays percentage of total portfolio
   - Icon: Bank notes

2. **Positions**
   - Number of different stocks you hold
   - Shows count description (e.g., "5 stocks held")
   - Icon: Chart bar

3. **Unrealized P&L**
   - Profit/loss across all current positions
   - Color-coded (green for profit, red for loss)
   - Icon: Dollar sign

4. **Best Performer**
   - Symbol of your best performing stock
   - Shows percentage gain
   - Icon: Trending up arrow

### 2. Quick Stats

Displays four key statistics in a grid layout:

1. **Total Invested** (Blue)
   - Amount of cash you've used to buy stocks
   - Calculated as: Starting Cash - Current Cash

2. **Total Return** (Green/Red)
   - Total profit or loss on your positions
   - Shows unrealized gains/losses

3. **Win Rate** (Purple)
   - Percentage of positions that are profitable
   - Calculated as: (Profitable Positions / Total Positions) × 100%

4. **Total Trades** (Orange)
   - Number of buy/sell transactions executed
   - Includes both buys and sells

### 3. Positions List

Shows all your current holdings with detailed information.

**Desktop View (Table):**
- Sortable columns (click header to sort)
- Click again to reverse sort direction

**Columns:**
- Symbol & Company Name
- Quantity (shares held)
- Avg Cost (average purchase price)
- Current Price (real-time)
- Total Value (quantity × current price)
- Gain/Loss ($ and %)
- Actions (Sell button)

**Mobile View (Cards):**
- Responsive card layout
- All information displayed in readable format
- Large "Sell All" button per position

**Features:**
- Color-coded gain/loss (green = profit, red = loss)
- Sortable by any column
- Empty state when no positions
- Sell confirmation dialog

### 4. User Level Badge

Located in the header (desktop only):
- Current level
- XP progress bar
- XP remaining until next level

## Using the Dashboard

### Viewing Your Portfolio

1. **Check Total Value**
   - See your total portfolio value at the top
   - View gain/loss compared to starting capital

2. **Monitor Cash**
   - Check available cash in the metrics grid
   - See what percentage of portfolio is cash

3. **Review Positions**
   - Scroll to Positions List
   - Sort by performance, value, or symbol
   - See detailed profit/loss for each holding

### Selling Positions

1. **Desktop:**
   - Click "Sell" button in the Actions column
   - Confirm the sale in the dialog
   - Position removed if selling all shares

2. **Mobile:**
   - Tap "Sell All" button on position card
   - Confirm the sale
   - Card disappears after successful sale

### Understanding Performance

**Win Rate:**
- Shows percentage of profitable positions
- Example: 3 out of 5 positions profitable = 60% win rate

**Best Performer:**
- Automatically updates based on percentage gain
- Useful for identifying successful picks

**Unrealized P&L:**
- Shows total profit/loss on current holdings
- Only realized when you sell

## Testing with Mock Data

### Method 1: Browser Console

Open your browser console (F12) and run:

```javascript
// Import the mock data utility
import { initializeMockPortfolio } from './utils/mockData';

// Initialize sample positions
initializeMockPortfolio();
```

This creates 5 sample positions with small profits.

### Method 2: Code Modification

In `src/App.tsx`, uncomment line 20:

```typescript
// Before:
// initializeMockPortfolio();

// After:
initializeMockPortfolio();
```

Save and refresh the page.

### Other Mock Functions

```javascript
import { resetPortfolio, generateRandomTrades } from './utils/mockData';

// Reset to initial state ($100,000 cash, no positions)
resetPortfolio();

// Generate 10 random trades
generateRandomTrades(10);
```

## Responsive Design

The dashboard adapts to different screen sizes:

**Desktop (≥1024px):**
- Full table view for positions
- 4-column grid for metrics
- User badge in header

**Tablet (≥768px):**
- 2-column grid for metrics
- Table view for positions
- Compact layout

**Mobile (<768px):**
- Single column layout
- Card view for positions
- Hidden user badge (shown in header only on larger screens)

## Keyboard Shortcuts

Currently no keyboard shortcuts implemented. This would be a good enhancement!

## Performance Tips

1. **Sorting Positions:**
   - Click column headers to sort
   - Click again to reverse order
   - Helps find best/worst performers quickly

2. **Cash Management:**
   - Keep some cash for opportunities
   - Dashboard shows cash percentage

3. **Diversification:**
   - Monitor number of positions
   - Quick Stats shows portfolio spread

## Future Enhancements

Planned features:
- Charts and graphs
- Historical performance tracking
- Transaction history view
- Watchlist management
- Price alerts
- Dark mode toggle
- Export to CSV
- Portfolio comparison

## Troubleshooting

### Positions not showing?
- Make sure you've executed trades
- Try running `initializeMockPortfolio()` in console

### Prices not updating?
- Check if price updates are running
- Refresh the page

### Build errors?
- Run `npm run build` to check for TypeScript errors
- Ensure all dependencies installed

## Component Files

Reference for developers:

- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/QuickStats.tsx`
- `src/components/dashboard/PositionsList.tsx`
- `src/components/common/Card.tsx`
- `src/components/common/Badge.tsx`
- `src/utils/mockData.ts`

## Related Documentation

- [STORES_USAGE.md](./STORES_USAGE.md) - Store usage guide
- [README.md](./README.md) - Project overview

---

Happy Trading! 📈
