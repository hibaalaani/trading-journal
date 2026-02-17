# Trading Journal - Professional Desktop Trading Analytics

A professional-grade trading journal application designed for active traders to track performance, calculate statistics, and analyze trading patterns.

## ✨ Features

### Core Functionality
- ✅ **Manual Trade Entry** - Record all trade details including entry/exit prices, position size, direction, and commission
- ✅ **Automatic Calculations** - Gross P/L, net P/L, return %, and win/loss classification calculated automatically
- ✅ **Edit & Delete Trades** - Full CRUD operations with automatic statistics recalculation
- ✅ **Commission Tracking** - Separate commission field with automatic deduction from profits

### Analytics & Statistics
- 📊 **Daily/Weekly/Monthly Views** - Filter and analyze trades by time period
- 📈 **Comprehensive Stats** - Win rate, average win/loss, risk/reward ratio, and more
- 💹 **Equity Curve** - Visual representation of account growth over time
- 🎯 **Performance Metrics** - Track total trades, commissions, largest wins/losses

### User Experience
- 🎨 **Professional Dark Theme** - Easy on the eyes during long trading sessions
- 📱 **Responsive Design** - Works on desktop and larger screens
- ⚡ **Fast & Lightweight** - SQLite database for instant performance
- 🔒 **Local Data Storage** - Your data stays on your computer

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (professional trading dashboard aesthetics)
- **Database**: SQLite (via Prisma ORM)
- **Charts**: Recharts
- **Icons**: Lucide React

### Why This Stack?

1. **React + TypeScript**: Type-safe, component-based architecture for scalability
2. **Vite**: Lightning-fast development and build times
3. **SQLite**: Perfect for desktop apps - no server needed, single file database
4. **Prisma**: Modern ORM that makes database migration to PostgreSQL trivial
5. **Tailwind**: Utility-first CSS for rapid UI development

### Project Structure
```
trading-journal/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── trading.db             # SQLite database (created after setup)
├── src/
│   ├── components/            # React components
│   │   ├── StatCard.tsx       # Metric display cards
│   │   ├── TradeForm.tsx      # Add/edit trade form
│   │   ├── TradeTable.tsx     # Trade list table
│   │   ├── EquityCurveChart.tsx  # Equity visualization
│   │   └── StatsOverview.tsx  # Detailed statistics
│   ├── lib/
│   │   ├── api.ts             # Database operations
│   │   ├── calculations.ts    # Trading calculations
│   │   └── db.ts              # Prisma client
│   ├── types/
│   │   └── trade.ts           # TypeScript definitions
│   ├── App.tsx                # Main application
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory**
```bash
cd trading-journal
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize database**
```bash
npx prisma db push
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📊 Database Schema

```prisma
model Trade {
  id            String   @id @default(uuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // User inputs
  date          DateTime
  asset         String
  direction     String   // "LONG" or "SHORT"
  entryPrice    Float
  exitPrice     Float
  positionSize  Float
  commission    Float
  notes         String?
  
  // Auto-calculated
  grossPL       Float    // Before commission
  netPL         Float    // After commission
  returnPercent Float    // Return percentage
  isWin         Boolean  // Profitable or not
}
```

## 🧮 Calculation Logic

### Trade Calculations

**Long Position:**
- Gross P/L = (Exit Price - Entry Price) × Position Size
- Net P/L = Gross P/L - Commission
- Return % = ((Exit Price - Entry Price) / Entry Price) × 100

**Short Position:**
- Gross P/L = (Entry Price - Exit Price) × Position Size
- Net P/L = Gross P/L - Commission
- Return % = ((Entry Price - Exit Price) / Entry Price) × 100

### Period Statistics

- **Win Rate** = (Winning Trades / Total Trades) × 100
- **Average Win** = Total Winning Trade P/L / Number of Wins
- **Average Loss** = Total Losing Trade P/L / Number of Losses
- **Risk/Reward Ratio** = Average Win / Average Loss
- **Net P/L** = Sum of all trades' net P/L
- **Total Commission** = Sum of all commission paid

## 🔄 Future SaaS Migration Path

This application is designed for easy conversion to a SaaS product:

### Database Migration
```prisma
// Simply change datasource in schema.prisma:
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Add User Authentication
```prisma
// Add to schema.prisma:
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  trades    Trade[]
}

model Trade {
  // ... existing fields
  userId    String
  user      User @relation(fields: [userId], references: [id])
}
```

### Convert to API
The current `src/lib/api.ts` functions can be converted to REST endpoints:
- `POST /api/trades` → createTrade()
- `GET /api/trades` → getAllTrades()
- `PUT /api/trades/:id` → updateTrade()
- `DELETE /api/trades/:id` → deleteTrade()

### Desktop Packaging (Optional)
Use **Tauri** to package as desktop app:
```bash
npm install -D @tauri-apps/cli
npm run tauri init
npm run tauri dev
npm run tauri build
```

## 💡 Usage Tips

### Adding a Trade
1. Click "Add Trade" button
2. Fill in all fields:
   - Date: Trading date
   - Asset: Stock symbol, crypto pair, etc.
   - Direction: LONG (buy) or SHORT (sell)
   - Entry/Exit Price: Trade prices
   - Position Size: Number of shares/units
   - Commission: Total fees paid
   - Notes: Optional trade notes
3. Click "Add Trade"

### Viewing Statistics
- **This Week**: See current week's performance
- **This Month**: Monthly overview
- **All Time**: Lifetime statistics

### Editing Trades
- Click edit icon (✏️) on any trade
- Modify fields as needed
- Changes auto-update all statistics

### Deleting Trades
- Click delete icon (🗑️)
- Confirm deletion
- Statistics automatically recalculate

## 🎯 Key Differentiators

1. **Accurate Calculations**: Handles both long and short positions correctly
2. **Commission Tracking**: Separate field for true P/L analysis
3. **Professional UI**: Dark theme optimized for traders
4. **Local-First**: No internet required, fast performance
5. **Scalable Design**: Easy migration to cloud/SaaS
6. **Type Safety**: Full TypeScript coverage prevents bugs

## 📝 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

This is a personal project, but suggestions welcome!

---

**Built with ❤️ for traders who take their performance seriously**
