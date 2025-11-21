import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useGamificationStore } from '../stores/gamificationStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { formatCurrency } from '../utils/formatting/currency';

export function Shop() {
  const powerups = useGamificationStore(s => s.powerups);
  const activePowerups = useGamificationStore(s => s.activePowerups);
  const buyPowerup = useGamificationStore(s => s.buyPowerup);
  const activatePowerup = useGamificationStore(s => s.activatePowerup);
  const isPowerupActive = useGamificationStore(s => s.isPowerupActive);
  const dailyRewards = useGamificationStore(s => s.dailyRewards);
  const claimDailyReward = useGamificationStore(s => s.claimDailyReward);
  const player = useGamificationStore(s => s.player);
  const cash = usePortfolioStore(s => s.portfolio.cash);

  const handleBuy = (id: string, price: number) => {
    if (cash >= price) {
      buyPowerup(id);
      // In a real app, we'd deduct from player's coins
      alert(`Purchased power-up for ${formatCurrency(price)}!`);
    } else {
      alert('Not enough cash!');
    }
  };

  const handleActivate = (id: string) => {
    activatePowerup(id);
    alert('Power-up activated!');
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 3600) {
      return `${seconds / 3600}h`;
    }
    return `${seconds / 60}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🛒 Power-Up Shop</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Boost your trading with special abilities
        </p>
        <div className="mt-4">
          <Badge variant="success" size="md">
            Cash Available: {formatCurrency(cash)}
          </Badge>
        </div>
      </div>

      {/* Daily Rewards */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">🎁 Daily Rewards</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Current Streak: {player.dailyStreak} days
        </p>
        <div className="grid grid-cols-7 gap-2">
          {dailyRewards.map(reward => (
            <div
              key={reward.day}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                reward.claimed
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">Day {reward.day}</div>
              <div className="text-lg font-bold">{reward.reward}</div>
              <div className="text-xs">XP</div>
              {!reward.claimed && reward.day === player.dailyStreak + 1 && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => claimDailyReward(reward.day)}
                  className="mt-2 text-xs"
                >
                  Claim
                </Button>
              )}
              {reward.claimed && (
                <span className="text-green-500 text-xs">✓</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Power-ups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {powerups.map(powerup => {
          const isActive = isPowerupActive(powerup.id);
          const activeInfo = activePowerups.find(p => p.id === powerup.id);
          const timeLeft = activeInfo ? Math.max(0, Math.floor((activeInfo.expiresAt - Date.now()) / 1000)) : 0;

          return (
            <Card key={powerup.id} className="relative overflow-hidden">
              {isActive && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
                  Active - {formatDuration(timeLeft)} left
                </div>
              )}

              <div className={`${isActive ? 'pt-6' : ''}`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{powerup.icon}</div>
                  <h3 className="text-xl font-bold">{powerup.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {powerup.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(powerup.price)}
                    </span>
                  </div>
                  <Badge variant="info">
                    Duration: {formatDuration(powerup.duration)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Owned: {powerup.owned}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleBuy(powerup.id, powerup.price)}
                    disabled={cash < powerup.price}
                  >
                    Buy for {formatCurrency(powerup.price)}
                  </Button>

                  {powerup.owned > 0 && !isActive && (
                    <Button
                      variant="success"
                      fullWidth
                      onClick={() => handleActivate(powerup.id)}
                    >
                      Activate ({powerup.owned} available)
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
