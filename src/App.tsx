import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Trading Game
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your journey to mastering trading starts here
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Learn to Trade
                </h3>
                <p className="text-primary-700">
                  Practice trading strategies without risking real money
                </p>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Track Performance
                </h3>
                <p className="text-green-700">
                  Monitor your portfolio and analyze your trading decisions
                </p>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Build Skills
                </h3>
                <p className="text-purple-700">
                  Improve your trading skills through realistic simulations
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button className="btn-primary">
                Start Trading
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
