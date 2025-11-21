import type { PowerUp } from '../types/gamification.types';
import { PowerUpEffect } from '../types/gamification.types';

export const POWERUPS: PowerUp[] = [
  {
    id: 'lower-fees',
    name: 'Fee Reducer',
    description: 'Reduce trading fees by 50% for 30 minutes',
    icon: '💸',
    price: 500,
    duration: 1800,
    effect: PowerUpEffect.LOWER_FEES,
    owned: 0
  },
  {
    id: 'insider-info',
    name: 'Insider Information',
    description: 'See predicted price movements for 15 minutes',
    icon: '👁️',
    price: 1000,
    duration: 900,
    effect: PowerUpEffect.INSIDER_INFO,
    owned: 0
  },
  {
    id: 'fast-execution',
    name: 'Fast Execution',
    description: 'Instant order execution for 20 minutes',
    icon: '⚡',
    price: 750,
    duration: 1200,
    effect: PowerUpEffect.FAST_EXECUTION,
    owned: 0
  },
  {
    id: 'double-xp',
    name: 'XP Booster',
    description: 'Double XP gain for 1 hour',
    icon: '⭐',
    price: 1500,
    duration: 3600,
    effect: PowerUpEffect.DOUBLE_XP,
    owned: 0
  },
  {
    id: 'price-alert',
    name: 'Price Alerts Pro',
    description: 'Get alerts for favorable price movements',
    icon: '🔔',
    price: 600,
    duration: 1800,
    effect: PowerUpEffect.PRICE_ALERT,
    owned: 0
  },
  {
    id: 'market-insight',
    name: 'Market Insights',
    description: 'Advanced analytics and trend predictions',
    icon: '📊',
    price: 2000,
    duration: 3600,
    effect: PowerUpEffect.MARKET_INSIGHT,
    owned: 0
  }
];
