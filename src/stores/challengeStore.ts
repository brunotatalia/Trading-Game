import { create } from 'zustand';
import type { Challenge, ChallengeProgress } from '../types/challenge.types';
import { CHALLENGES } from '../constants/challenges';

interface ChallengeState {
  activeChallenges: Challenge[];
  currentChallenge: Challenge | null;
  challengeProgress: ChallengeProgress | null;
  completedChallenges: string[];
  startChallenge: (challengeId: string) => void;
  endChallenge: (success: boolean, finalValue: number) => void;
  getChallengeById: (id: string) => Challenge | undefined;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  activeChallenges: CHALLENGES,
  currentChallenge: null,
  challengeProgress: null,
  completedChallenges: [],

  startChallenge: (challengeId) => {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    set({
      currentChallenge: challenge,
      challengeProgress: {
        challengeId,
        startTime: new Date(),
        completed: false,
        success: false
      }
    });
  },

  endChallenge: (success, finalValue) => {
    const { currentChallenge, challengeProgress, completedChallenges } = get();
    if (!currentChallenge || !challengeProgress) return;

    const newCompleted = success
      ? [...completedChallenges, currentChallenge.id]
      : completedChallenges;

    set({
      challengeProgress: {
        ...challengeProgress,
        endTime: new Date(),
        completed: true,
        success,
        finalValue
      },
      completedChallenges: newCompleted,
      currentChallenge: null
    });
  },

  getChallengeById: (id) => {
    return CHALLENGES.find(c => c.id === id);
  }
}));
