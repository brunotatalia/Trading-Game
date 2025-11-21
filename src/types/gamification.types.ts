export interface PlayerStats {
  id: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  tradesExecuted: number;
  profitableTrades: number;
  totalProfit: number;
  bestTrade: number;
  winRate: number;
  achievements: string[];
  dailyStreak: number;
  lastLoginDate: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'trading' | 'portfolio' | 'challenges' | 'social';
  requirement: string;
}

export interface DailyReward {
  day: number;
  reward: number;
  claimed: boolean;
  claimedAt?: Date;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  duration: number; // seconds
  effect: PowerUpEffect;
  owned: number;
}

export const PowerUpEffect = {
  LOWER_FEES: 'LOWER_FEES',
  INSIDER_INFO: 'INSIDER_INFO',
  FAST_EXECUTION: 'FAST_EXECUTION',
  DOUBLE_XP: 'DOUBLE_XP',
  PRICE_ALERT: 'PRICE_ALERT',
  MARKET_INSIGHT: 'MARKET_INSIGHT'
} as const;

export type PowerUpEffect = typeof PowerUpEffect[keyof typeof PowerUpEffect];
