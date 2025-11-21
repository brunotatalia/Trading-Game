import type { Challenge } from '../types/challenge.types';
import { ChallengeType, ChallengeDifficulty } from '../types/challenge.types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'speed-trader-easy',
    type: ChallengeType.SPEED_TRADER,
    name: 'Speed Trader - Easy',
    description: 'Turn $10,000 into $100,000 in 10 minutes!',
    difficulty: ChallengeDifficulty.EASY,
    timeLimit: 600,
    startingCash: 10000,
    goal: 'Reach $100,000',
    reward: 500,
    icon: '⚡'
  },
  {
    id: 'speed-trader-medium',
    type: ChallengeType.SPEED_TRADER,
    name: 'Speed Trader - Medium',
    description: 'Turn $10,000 into $100,000 in 5 minutes!',
    difficulty: ChallengeDifficulty.MEDIUM,
    timeLimit: 300,
    startingCash: 10000,
    goal: 'Reach $100,000',
    reward: 1000,
    icon: '⚡'
  },
  {
    id: 'speed-trader-hard',
    type: ChallengeType.SPEED_TRADER,
    name: 'Speed Trader - Hard',
    description: 'Turn $10,000 into $100,000 in 3 minutes!',
    difficulty: ChallengeDifficulty.HARD,
    timeLimit: 180,
    startingCash: 10000,
    goal: 'Reach $100,000',
    reward: 2000,
    icon: '⚡'
  },
  {
    id: 'bull-rush',
    type: ChallengeType.BULL_RUSH,
    name: 'Bull Market Rush',
    description: 'Make $50,000 profit during a bull market!',
    difficulty: ChallengeDifficulty.MEDIUM,
    timeLimit: 600,
    startingCash: 100000,
    goal: 'Profit $50,000',
    reward: 1500,
    icon: '📈'
  },
  {
    id: 'crash-survivor',
    type: ChallengeType.CRASH_SURVIVOR,
    name: 'Crash Survivor',
    description: "Survive a market crash! Don't lose more than 20%",
    difficulty: ChallengeDifficulty.HARD,
    timeLimit: 300,
    startingCash: 100000,
    goal: 'Keep portfolio above $80,000',
    reward: 2500,
    icon: '📉'
  },
  {
    id: 'perfect-timing',
    type: ChallengeType.PERFECT_TIMING,
    name: 'Perfect Timing',
    description: 'Execute 5 perfect trades (buy low, sell high)',
    difficulty: ChallengeDifficulty.MEDIUM,
    timeLimit: 600,
    startingCash: 50000,
    goal: '5 profitable trades',
    reward: 1200,
    icon: '🎯'
  },
  {
    id: 'diversification',
    type: ChallengeType.DIVERSIFICATION,
    name: 'Diversification Master',
    description: 'Build a portfolio with stocks from 8 different sectors',
    difficulty: ChallengeDifficulty.EASY,
    timeLimit: 600,
    startingCash: 100000,
    goal: '8 sectors represented',
    reward: 800,
    icon: '🎨'
  },
  {
    id: 'day-trader',
    type: ChallengeType.DAY_TRADER,
    name: 'Day Trader Pro',
    description: 'Complete 20 profitable trades in one session',
    difficulty: ChallengeDifficulty.HARD,
    timeLimit: 900,
    startingCash: 50000,
    goal: '20 winning trades',
    reward: 3000,
    icon: '💼'
  }
];
