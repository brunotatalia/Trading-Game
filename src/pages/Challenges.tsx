import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useChallengeStore } from '../stores/challengeStore';
import { ChallengeDifficulty } from '../types/challenge.types';

export function Challenges() {
  const challenges = useChallengeStore(s => s.activeChallenges);
  const completed = useChallengeStore(s => s.completedChallenges);
  const startChallenge = useChallengeStore(s => s.startChallenge);

  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filtered = challenges.filter(c => {
    if (filter === 'all') return true;
    return c.difficulty.toLowerCase() === filter;
  });

  const handleStart = (challengeId: string) => {
    startChallenge(challengeId);
    alert('Challenge started! (Challenge play mode coming soon)');
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case ChallengeDifficulty.EASY: return 'success';
      case ChallengeDifficulty.MEDIUM: return 'warning';
      case ChallengeDifficulty.HARD: return 'danger';
      case ChallengeDifficulty.EXTREME: return 'danger';
      default: return 'info';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Challenge Modes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test your trading skills with time-limited challenges!
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'easy' ? 'primary' : 'outline'}
          onClick={() => setFilter('easy')}
        >
          Easy
        </Button>
        <Button
          variant={filter === 'medium' ? 'primary' : 'outline'}
          onClick={() => setFilter('medium')}
        >
          Medium
        </Button>
        <Button
          variant={filter === 'hard' ? 'primary' : 'outline'}
          onClick={() => setFilter('hard')}
        >
          Hard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(challenge => {
          const isCompleted = completed.includes(challenge.id);

          return (
            <Card key={challenge.id} className="hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{challenge.icon}</div>
                <Badge variant={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-2">{challenge.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {challenge.description}
              </p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Limit:</span>
                  <span className="font-semibold">{Math.floor(challenge.timeLimit / 60)} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Starting Cash:</span>
                  <span className="font-semibold">${challenge.startingCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reward:</span>
                  <span className="font-semibold text-yellow-600">+{challenge.reward} XP</span>
                </div>
              </div>

              {isCompleted && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold">Completed!</span>
                  </div>
                </div>
              )}

              <Button
                variant={isCompleted ? 'secondary' : 'success'}
                fullWidth
                onClick={() => handleStart(challenge.id)}
              >
                {isCompleted ? 'Play Again' : 'Start Challenge'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
