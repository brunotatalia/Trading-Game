import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useGamificationStore } from '../stores/gamificationStore';

export function Achievements() {
  const achievements = useGamificationStore(s => s.achievements);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPEarned = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const categories = ['trading', 'portfolio', 'challenges', 'social'] as const;
  const categoryNames = {
    trading: '📊 Trading',
    portfolio: '💼 Portfolio',
    challenges: '🏆 Challenges',
    social: '👥 Social'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🏆 Achievements</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and unlock rewards
        </p>
      </div>

      {/* Stats Overview */}
      <Card>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unlockedCount}/{achievements.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Unlocked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalXPEarned}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">XP Earned</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Achievements by Category */}
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;

        return (
          <Card key={category}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{categoryNames[category]}</h2>
              <Badge variant="info">
                {categoryUnlocked}/{categoryAchievements.length}
              </Badge>
            </div>

            <div className="grid gap-4">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className={`text-4xl ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Requirement: {achievement.requirement}
                      </span>
                      <Badge variant={achievement.unlocked ? 'success' : 'warning'} size="sm">
                        +{achievement.xpReward} XP
                      </Badge>
                    </div>
                  </div>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      Unlocked
                      <br />
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
