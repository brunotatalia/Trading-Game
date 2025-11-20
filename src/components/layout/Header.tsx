import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Trading Game
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">
              Dashboard
            </Link>
            <Link to="/trading" className="text-gray-600 hover:text-primary-600 font-medium">
              Trading
            </Link>
            <Link to="/options" className="text-gray-600 hover:text-primary-600 font-medium">
              Options
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
