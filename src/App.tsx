import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePriceStore } from './stores/priceStore';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Options } from './pages/Options';

function App() {
  const startSimulation = usePriceStore(s => s.startSimulation);

  useEffect(() => {
    startSimulation();

    return () => {
      usePriceStore.getState().stopSimulation();
    };
  }, [startSimulation]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/options" element={<Options />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
