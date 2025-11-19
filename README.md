# Trading Game 🎮📈

A modern trading simulation game built with React, TypeScript, and Vite. Practice trading strategies without risking real money!

## Features

- 📊 **Realistic Trading Simulation** - Practice with simulated market data
- 💼 **Portfolio Management** - Track your positions and performance
- 📈 **Performance Analytics** - Analyze your trading decisions
- 🎯 **Multiple Order Types** - Market, Limit, Stop, and Stop-Limit orders
- 💰 **Real-time Price Updates** - Simulated live market data
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper for local data persistence
- **Dinero.js** - Money handling
- **Headless UI** - Accessible UI components
- **Hero Icons** - Beautiful icons
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brunotatalia/Trading-Game.git
cd Trading-Game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   ├── common/         # Reusable common components
│   └── dashboard/      # Dashboard-specific components
├── stores/             # Zustand state stores
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   └── calculations/   # Trading calculations
├── types/              # TypeScript type definitions
│   ├── trading.types.ts
│   ├── portfolio.types.ts
│   └── market.types.ts
├── services/           # API and service layer
└── constants/          # App constants
```

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite, React, and TypeScript
- [x] Tailwind CSS configuration
- [x] Basic layout components
- [x] Type definitions

### Phase 2: Core Features (Coming Soon)
- [ ] Portfolio management
- [ ] Trading interface
- [ ] Order book simulation
- [ ] Price chart integration

### Phase 3: Advanced Features
- [ ] Historical data analysis
- [ ] Performance metrics
- [ ] Trading strategies
- [ ] Leaderboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Built with ❤️ for traders and developers
