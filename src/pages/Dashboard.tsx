import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { PositionsList } from '../components/dashboard/PositionsList';

export function Dashboard() {
  return (
    <div>
      <PortfolioSummary />
      <PositionsList />
    </div>
  );
}
