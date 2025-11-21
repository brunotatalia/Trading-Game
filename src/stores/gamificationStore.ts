import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerStats, Achievement, DailyReward, PowerUp } from '../types/gamification.types';
import { ACHIEVEMENTS } from '../constants/achievements';
import { POWERUPS } from '../constants/powerups';

interface TradeHistoryEntry {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  profit?: number;
}

interface GamificationState {
  player: PlayerStats;
  achievements: Achievement[];
  powerups: PowerUp[];
  dailyRewards: DailyReward[];
  tradeHistory: TradeHistoryEntry[];
  activePowerups: { id: string; expiresAt: number }[];

  // Actions
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  buyPowerup: (id: string) => void;
  activatePowerup: (id: string) => void;
  claimDailyReward: (day: number) => void;
  recordTrade: (trade: Omit<TradeHistoryEntry, 'id' | 'timestamp'>) => void;
  updateStats: (stats: Partial<PlayerStats>) => void;
  checkAchievements: () => void;
  isPowerupActive: (id: string) => boolean;
}

const XP_PER_LEVEL = 1000;
const XP_MULTIPLIER = 1.5;

function calculateXPForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

function generateDailyRewards(): DailyReward[] {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    reward: (i + 1) * 100,
    claimed: false
  }));
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      player: {
        id: crypto.randomUUID(),
        username: 'Trader',
        level: 1,
        xp: 0,
        xpToNextLevel: XP_PER_LEVEL,
        totalXP: 0,
        tradesExecuted: 0,
        profitableTrades: 0,
        totalProfit: 0,
        bestTrade: 0,
        winRate: 0,
        achievements: [],
        dailyStreak: 0,
        lastLoginDate: new Date()
      },
      achievements: ACHIEVEMENTS.map(a => ({ ...a })),
      powerups: POWERUPS.map(p => ({ ...p })),
      dailyRewards: generateDailyRewards(),
      tradeHistory: [],
      activePowerups: [],

      addXP: (amount: number) => {
        set(state => {
          const doubleXPActive = state.activePowerups.some(
            p => p.id === 'double-xp' && p.expiresAt > Date.now()
          );
          const finalAmount = doubleXPActive ? amount * 2 : amount;

          let newXP = state.player.xp + finalAmount;
          let newLevel = state.player.level;
          let newXPToNext = state.player.xpToNextLevel;

          while (newXP >= newXPToNext) {
            newXP -= newXPToNext;
            newLevel++;
            newXPToNext = calculateXPForLevel(newLevel);
          }

          return {
            player: {
              ...state.player,
              xp: newXP,
              level: newLevel,
              xpToNextLevel: newXPToNext,
              totalXP: state.player.totalXP + finalAmount
            }
          };
        });
      },

      unlockAchievement: (id: string) => {
        set(state => {
          const achievement = state.achievements.find(a => a.id === id);
          if (!achievement || achievement.unlocked) return state;

          const updatedAchievements = state.achievements.map(a =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
          );

          return {
            achievements: updatedAchievements,
            player: {
              ...state.player,
              achievements: [...state.player.achievements, id]
            }
          };
        });

        // Add XP reward
        const achievement = get().achievements.find(a => a.id === id);
        if (achievement) {
          get().addXP(achievement.xpReward);
        }
      },

      buyPowerup: (id: string) => {
        set(state => {
          const powerup = state.powerups.find(p => p.id === id);
          if (!powerup) return state;

          // In a real app, we'd check player's coins here
          const updatedPowerups = state.powerups.map(p =>
            p.id === id ? { ...p, owned: p.owned + 1 } : p
          );

          return { powerups: updatedPowerups };
        });
      },

      activatePowerup: (id: string) => {
        set(state => {
          const powerup = state.powerups.find(p => p.id === id);
          if (!powerup || powerup.owned <= 0) return state;

          const updatedPowerups = state.powerups.map(p =>
            p.id === id ? { ...p, owned: p.owned - 1 } : p
          );

          const expiresAt = Date.now() + powerup.duration * 1000;

          return {
            powerups: updatedPowerups,
            activePowerups: [
              ...state.activePowerups.filter(p => p.id !== id),
              { id, expiresAt }
            ]
          };
        });
      },

      claimDailyReward: (day: number) => {
        set(state => {
          const reward = state.dailyRewards.find(r => r.day === day);
          if (!reward || reward.claimed) return state;

          const updatedRewards = state.dailyRewards.map(r =>
            r.day === day ? { ...r, claimed: true, claimedAt: new Date() } : r
          );

          return {
            dailyRewards: updatedRewards,
            player: {
              ...state.player,
              dailyStreak: state.player.dailyStreak + 1
            }
          };
        });

        // Add XP for daily reward
        const reward = get().dailyRewards.find(r => r.day === day);
        if (reward) {
          get().addXP(reward.reward);
        }
      },

      recordTrade: (trade) => {
        const entry: TradeHistoryEntry = {
          ...trade,
          id: crypto.randomUUID(),
          timestamp: new Date()
        };

        set(state => {
          const newHistory = [entry, ...state.tradeHistory].slice(0, 100);
          const tradesExecuted = state.player.tradesExecuted + 1;
          const profitableTrades = trade.profit && trade.profit > 0
            ? state.player.profitableTrades + 1
            : state.player.profitableTrades;
          const totalProfit = state.player.totalProfit + (trade.profit || 0);
          const bestTrade = trade.profit && trade.profit > state.player.bestTrade
            ? trade.profit
            : state.player.bestTrade;
          const winRate = tradesExecuted > 0
            ? (profitableTrades / tradesExecuted) * 100
            : 0;

          return {
            tradeHistory: newHistory,
            player: {
              ...state.player,
              tradesExecuted,
              profitableTrades,
              totalProfit,
              bestTrade,
              winRate
            }
          };
        });

        // Add XP for trading
        get().addXP(10);
        get().checkAchievements();
      },

      updateStats: (stats) => {
        set(state => ({
          player: { ...state.player, ...stats }
        }));
      },

      checkAchievements: () => {
        const state = get();
        const { player, achievements } = state;

        // First trade
        if (player.tradesExecuted >= 1 && !achievements.find(a => a.id === 'first-trade')?.unlocked) {
          get().unlockAchievement('first-trade');
        }

        // 100 trades
        if (player.tradesExecuted >= 100 && !achievements.find(a => a.id === 'trader-100')?.unlocked) {
          get().unlockAchievement('trader-100');
        }

        // 50 trades in one day (day-trader) - would need daily tracking
        if (player.tradesExecuted >= 50 && !achievements.find(a => a.id === 'day-trader')?.unlocked) {
          get().unlockAchievement('day-trader');
        }
      },

      isPowerupActive: (id: string) => {
        const state = get();
        return state.activePowerups.some(
          p => p.id === id && p.expiresAt > Date.now()
        );
      }
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({
        player: state.player,
        achievements: state.achievements,
        powerups: state.powerups,
        dailyRewards: state.dailyRewards,
        tradeHistory: state.tradeHistory,
        activePowerups: state.activePowerups
      })
    }
  )
);
