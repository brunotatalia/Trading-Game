import { create } from 'zustand';

interface UserState {
  userId: string;
  username: string;
  level: number;
  xp: number;
  achievements: string[];
}

interface UserActions {
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  levelUp: () => void;
  setUsername: (username: string) => void;
}

type UserStore = UserState & UserActions;

const XP_PER_LEVEL = 1000;

/**
 * Generates a unique user ID
 */
const generateUserId = () => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates the XP required for next level
 */
const xpForNextLevel = (currentLevel: number): number => {
  return currentLevel * XP_PER_LEVEL;
};

export const useUserStore = create<UserStore>((set) => ({
  userId: generateUserId(),
  username: 'Trader',
  level: 1,
  xp: 0,
  achievements: [],

  /**
   * Adds XP to the user and checks for level up
   */
  addXP: (amount: number) => {
    set((state) => {
      const newXP = state.xp + amount;
      const xpNeeded = xpForNextLevel(state.level);

      // Check if user should level up
      if (newXP >= xpNeeded) {
        const remainingXP = newXP - xpNeeded;
        return {
          xp: remainingXP,
          level: state.level + 1,
        };
      }

      return { xp: newXP };
    });
  },

  /**
   * Unlocks an achievement if not already unlocked
   */
  unlockAchievement: (id: string) => {
    set((state) => {
      if (state.achievements.includes(id)) {
        return state; // Already unlocked
      }

      // Award XP for achievement (100 XP per achievement)
      const newXP = state.xp + 100;
      const xpNeeded = xpForNextLevel(state.level);

      // Check if user should level up from achievement XP
      if (newXP >= xpNeeded) {
        const remainingXP = newXP - xpNeeded;
        return {
          achievements: [...state.achievements, id],
          xp: remainingXP,
          level: state.level + 1,
        };
      }

      return {
        achievements: [...state.achievements, id],
        xp: newXP,
      };
    });
  },

  /**
   * Manually triggers a level up (used internally)
   */
  levelUp: () => {
    set((state) => ({
      level: state.level + 1,
      xp: 0,
    }));
  },

  /**
   * Sets the username
   */
  setUsername: (username: string) => {
    set({ username });
  },
}));

/**
 * Achievement IDs and their descriptions
 */
export const ACHIEVEMENTS = {
  FIRST_TRADE: {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Execute your first trade',
  },
  PROFIT_1K: {
    id: 'profit_1k',
    name: 'Profit Master',
    description: 'Earn $1,000 in profit',
  },
  PROFIT_10K: {
    id: 'profit_10k',
    name: 'Big Gains',
    description: 'Earn $10,000 in profit',
  },
  PORTFOLIO_200K: {
    id: 'portfolio_200k',
    name: 'Double Down',
    description: 'Grow your portfolio to $200,000',
  },
  TRADER_10: {
    id: 'trader_10',
    name: 'Active Trader',
    description: 'Execute 10 trades',
  },
  TRADER_100: {
    id: 'trader_100',
    name: 'Trading Veteran',
    description: 'Execute 100 trades',
  },
  DIVERSIFIED_5: {
    id: 'diversified_5',
    name: 'Diversified',
    description: 'Hold 5 different positions',
  },
  DIVERSIFIED_10: {
    id: 'diversified_10',
    name: 'Well Diversified',
    description: 'Hold 10 different positions',
  },
} as const;
