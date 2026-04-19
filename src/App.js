import TowerDefenseGame from './game/TowerDefenseGame';
import ErrorBoundary from './game/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <TowerDefenseGame />
    </ErrorBoundary>
  );
}
