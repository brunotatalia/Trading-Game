import type { Achievement } from '../types/gamification.types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-trade',
    name: 'First Steps',
    description: 'Execute your first trade',
    icon: '🎯',
    xpReward: 100,
    unlocked: false,
    category: 'trading',
    requirement: '1 trade'
  },
  {
    id: 'trader-100',
    name: 'Active Trader',
    description: 'Execute 100 trades',
    icon: '📊',
    xpReward: 1000,
    unlocked: false,
    category: 'trading',
    requirement: '100 trades'
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Reach $1,000,000 portfolio value',
    icon: '💰',
    xpReward: 5000,
    unlocked: false,
    category: 'portfolio',
    requirement: '$1M portfolio'
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Make profit 7 days in a row',
    icon: '📈',
    xpReward: 2000,
    unlocked: false,
    category: 'trading',
    requirement: '7 day streak'
  },
  {
    id: 'diversified',
    name: 'Diversification Expert',
    description: 'Own stocks from 10 different sectors',
    icon: '🎨',
    xpReward: 1500,
    unlocked: false,
    category: 'portfolio',
    requirement: '10 sectors'
  },
  {
    id: 'challenge-master',
    name: 'Challenge Master',
    description: 'Complete 10 challenges',
    icon: '🏆',
    xpReward: 3000,
    unlocked: false,
    category: 'challenges',
    requirement: '10 challenges'
  },
  {
    id: 'day-trader',
    name: 'Day Trader',
    description: 'Execute 50 trades in one day',
    icon: '⚡',
    xpReward: 2500,
    unlocked: false,
    category: 'trading',
    requirement: '50 trades/day'
  },
  {
    id: 'bull-master',
    name: 'Bull Market Master',
    description: 'Gain 100% profit in one session',
    icon: '🐂',
    xpReward: 4000,
    unlocked: false,
    category: 'trading',
    requirement: '100% profit'
  },
  {
    id: 'options-guru',
    name: 'Options Guru',
    description: 'Successfully trade 20 options contracts',
    icon: '🎓',
    xpReward: 3500,
    unlocked: false,
    category: 'trading',
    requirement: '20 options trades'
  },
  {
    id: 'loyal-player',
    name: 'Loyal Player',
    description: 'Login 30 days in a row',
    icon: '🔥',
    xpReward: 5000,
    unlocked: false,
    category: 'social',
    requirement: '30 day streak'
  }
];
