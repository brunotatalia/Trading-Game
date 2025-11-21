import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePriceStore } from './stores/priceStore';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Options } from './pages/Options';
import { Challenges } from './pages/Challenges';
import { Shop } from './pages/Shop';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { History } from './pages/History';

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
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/options" element={<Options />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
