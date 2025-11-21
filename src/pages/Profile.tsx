import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useGamificationStore } from '../stores/gamificationStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceStore } from '../stores/priceStore';
import { formatCurrency, formatPercent } from '../utils/formatting/currency';

export function Profile() {
  const player = useGamificationStore(s => s.player);
  const achievements = useGamificationStore(s => s.achievements);
  const powerups = useGamificationStore(s => s.powerups);
  const activePowerups = useGamificationStore(s => s.activePowerups);
  const portfolio = usePortfolioStore(s => s.portfolio);
  const getTotalValue = usePortfolioStore(s => s.getTotalValue);
  const prices = usePriceStore(s => s.prices);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPowerupsOwned = powerups.reduce((sum, p) => sum + p.owned, 0);
  const xpProgress = (player.xp / player.xpToNextLevel) * 100;

  // Calculate portfolio values
  const priceMap = Object.fromEntries(
    Object.entries(prices).map(([symbol, data]) => [symbol, data.price])
  );
  const totalValue = getTotalValue(priceMap);
  const totalPL = totalValue - portfolio.startingCash;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">👤 Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your trading journey at a glance
        </p>
      </div>

      {/* Player Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
            🎮
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="warning" size="md">
                Level {player.level}
              </Badge>
              <span className="text-sm opacity-80">
                {player.totalXP.toLocaleString()} Total XP
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>XP Progress</span>
            <span>{player.xp} / {player.xpToNextLevel}</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold">{player.tradesExecuted}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Trades Executed</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatPercent(player.winRate)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Win Rate</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className={`text-3xl font-bold ${player.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(player.totalProfit)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Profit</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(player.bestTrade)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Best Trade</div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trading Stats */}
        <Card>
          <h3 className="text-xl font-bold mb-4">📈 Trading Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Profitable Trades</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {player.profitableTrades}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Current Cash</span>
              <span className="font-bold">{formatCurrency(portfolio.cash)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Portfolio Value</span>
              <span className="font-bold">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total P&L</span>
              <span className={`font-bold ${totalPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totalPL)}
              </span>
            </div>
          </div>
        </Card>

        {/* Achievements & Powerups */}
        <Card>
          <h3 className="text-xl font-bold mb-4">🎮 Game Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Daily Streak</span>
              <span className="font-bold text-orange-500">
                🔥 {player.dailyStreak} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Achievements Unlocked</span>
              <span className="font-bold">
                {unlockedAchievements.length}/{achievements.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Power-ups Owned</span>
              <span className="font-bold">{totalPowerupsOwned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Power-ups</span>
              <span className="font-bold text-green-500">{activePowerups.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold mb-4">🏅 Recent Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {unlockedAchievements.slice(0, 4).map(achievement => (
              <div
                key={achievement.id}
                className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-sm">{achievement.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{achievement.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
