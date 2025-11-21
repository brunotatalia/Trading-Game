export const ChallengeType = {
  SPEED_TRADER: 'SPEED_TRADER',
  BULL_RUSH: 'BULL_RUSH',
  CRASH_SURVIVOR: 'CRASH_SURVIVOR',
  PERFECT_TIMING: 'PERFECT_TIMING',
  DIVERSIFICATION: 'DIVERSIFICATION',
  DAY_TRADER: 'DAY_TRADER',
  OPTIONS_WIZARD: 'OPTIONS_WIZARD',
  MARGIN_MASTER: 'MARGIN_MASTER'
} as const;

export type ChallengeType = typeof ChallengeType[keyof typeof ChallengeType];

export const ChallengeDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EXTREME: 'EXTREME'
} as const;

export type ChallengeDifficulty = typeof ChallengeDifficulty[keyof typeof ChallengeDifficulty];

export interface Challenge {
  id: string;
  type: ChallengeType;
  name: string;
  description: string;
  difficulty: ChallengeDifficulty;
  timeLimit: number; // seconds
  startingCash: number;
  goal: string;
  reward: number; // XP
  icon: string;
}

export interface ChallengeProgress {
  challengeId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  success: boolean;
  finalValue?: number;
}
