import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Portfolio } from './pages/Portfolio';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
