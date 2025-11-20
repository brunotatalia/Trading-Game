import { useEffect } from 'react';
import { usePriceStore } from './stores/priceStore';

function App() {
  const startSimulation = usePriceStore(s => s.startSimulation);

  useEffect(() => {
    startSimulation();

    return () => {
      usePriceStore.getState().stopSimulation();
    };
  }, [startSimulation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Trading Game</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Foundation Ready!</h2>
          <p className="text-gray-600">
            Project setup complete. Price simulation running.
            Ready for Dashboard and Trading components!
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
