# Trading Journal - Complete File Structure

```
trading-journal/
│
├── 📁 prisma/                          # Database configuration
│   ├── schema.prisma                   # Prisma schema (SQLite → PostgreSQL ready)
│   └── trading.db                      # SQLite database file (auto-generated)
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 components/                  # React components
│   │   ├── StatCard.tsx                # Metric display card component
│   │   ├── TradeForm.tsx               # Add/Edit trade modal form
│   │   ├── TradeTable.tsx              # Trade list table with edit/delete
│   │   ├── EquityCurveChart.tsx        # Equity growth visualization
│   │   └── StatsOverview.tsx           # Detailed statistics panel
│   │
│   ├── 📁 lib/                         # Business logic & utilities
│   │   ├── api.ts                      # Database operations (CRUD)
│   │   ├── calculations.ts             # Trading calculations engine
│   │   └── db.ts                       # Prisma client singleton
│   │
│   ├── 📁 types/                       # TypeScript type definitions
│   │   └── trade.ts                    # Trade, Stats, and Form types
│   │
│   ├── App.tsx                         # Main application component
│   ├── main.tsx                        # React entry point
│   └── index.css                       # Global CSS + Tailwind imports
│
├── 📄 index.html                       # HTML entry point
├── 📄 package.json                     # Dependencies & scripts
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 tsconfig.node.json               # TypeScript config for Vite
├── 📄 vite.config.ts                   # Vite build configuration
├── 📄 tailwind.config.js               # Tailwind CSS configuration
├── 📄 postcss.config.js                # PostCSS configuration
├── 📄 .gitignore                       # Git ignore rules
│
├── 📖 README.md                        # Main documentation
├── 📖 SETUP.md                         # Installation guide
├── 📖 ARCHITECTURE.md                  # Technical architecture docs
└── 📖 PROJECT_STRUCTURE.md             # This file
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                             │
│  (Root component - manages state & data flow)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │  StatCard × 4  │  │   TradeForm    │  │  TradeTable  │ │
│  │                │  │  (Modal Form)  │  │              │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
│                                                             │
│  ┌────────────────────────────┐  ┌─────────────────────┐  │
│  │   EquityCurveChart         │  │   StatsOverview     │  │
│  │   (Recharts LineChart)     │  │   (Detailed Stats)  │  │
│  └────────────────────────────┘  └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
           ↓                           ↓
    ┌──────────────┐          ┌──────────────────┐
    │   api.ts     │          │  calculations.ts │
    │  (DB Ops)    │          │  (Trading Math)  │
    └──────────────┘          └──────────────────┘
           ↓
    ┌──────────────┐
    │  Prisma ORM  │
    └──────────────┘
           ↓
    ┌──────────────┐
    │    SQLite    │
    │  trading.db  │
    └──────────────┘
```

## File Purposes

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler options for app code |
| `tsconfig.node.json` | TypeScript config for build tools (Vite) |
| `vite.config.ts` | Vite bundler configuration |
| `tailwind.config.js` | Tailwind CSS theme customization |
| `postcss.config.js` | CSS processing configuration |
| `.gitignore` | Files to exclude from version control |

### Database Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition |
| `prisma/trading.db` | SQLite database (auto-generated) |

### Source Code - Components

| File | Lines | Purpose |
|------|-------|---------|
| `StatCard.tsx` | ~40 | Reusable metric display card |
| `TradeForm.tsx` | ~160 | Add/edit trade form with validation |
| `TradeTable.tsx` | ~120 | Trade list with edit/delete actions |
| `EquityCurveChart.tsx` | ~60 | Equity growth line chart |
| `StatsOverview.tsx` | ~90 | Comprehensive statistics panel |

### Source Code - Business Logic

| File | Lines | Purpose |
|------|-------|---------|
| `lib/api.ts` | ~150 | Database CRUD operations |
| `lib/calculations.ts` | ~180 | Trading math & statistics |
| `lib/db.ts` | ~15 | Prisma client setup |

### Source Code - Types

| File | Lines | Purpose |
|------|-------|---------|
| `types/trade.ts` | ~60 | TypeScript interfaces & types |

### Source Code - App

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | ~250 | Main application logic |
| `main.tsx` | ~10 | React DOM render |
| `index.css` | ~40 | Global styles & Tailwind |

## Data Flow Example

```
User clicks "Add Trade"
    ↓
TradeForm modal opens
    ↓
User fills: AAPL, LONG, entry: 150, exit: 155, size: 100, commission: 2
    ↓
Form submits → handleAddTrade() in App.tsx
    ↓
Calls createTrade() in api.ts
    ↓
Calls calculateTradeMetrics() in calculations.ts
    ├── grossPL = (155 - 150) × 100 = $500
    ├── netPL = $500 - $2 = $498
    ├── returnPercent = ((155-150)/150) × 100 = 3.33%
    └── isWin = true
    ↓
Prisma creates database record
    ↓
loadTrades() refreshes all data
    ↓
UI updates:
    ├── Trade appears in table
    ├── Stats cards recalculate
    ├── Equity curve updates
    └── Stats overview refreshes
```

## Build Output Structure

After running `npm run build`:

```
dist/
├── assets/
│   ├── index-[hash].js          # Bundled JavaScript
│   ├── index-[hash].css         # Bundled CSS
│   └── ...                       # Other assets
├── index.html                    # Entry HTML
└── vite.svg                      # Favicon
```

## Development vs Production

### Development Mode (`npm run dev`)
- Fast hot reload
- Source maps enabled
- Verbose error messages
- Prisma Client in development mode

### Production Build (`npm run build`)
- Minified JavaScript
- Optimized CSS
- Tree-shaking (removes unused code)
- Hash-based cache busting

## Database Schema Visual

```
┌─────────────────────────────────────────┐
│              Trade Table                │
├─────────────────────────────────────────┤
│ id              String (UUID) PK        │
│ createdAt       DateTime               │
│ updatedAt       DateTime               │
├─────────────────────────────────────────┤
│ date            DateTime               │
│ asset           String                 │
│ direction       String (LONG/SHORT)    │
│ entryPrice      Float                  │
│ exitPrice       Float                  │
│ positionSize    Float                  │
│ commission      Float                  │
│ notes           String?                │
├─────────────────────────────────────────┤
│ grossPL         Float (calculated)     │
│ netPL           Float (calculated)     │
│ returnPercent   Float (calculated)     │
│ isWin           Boolean (calculated)   │
└─────────────────────────────────────────┘
       Index on: date
```

## Import/Export Dependencies

### External Dependencies
```
React → UI framework
Prisma → Database ORM
Recharts → Chart library
Tailwind → CSS framework
Vite → Build tool
date-fns → Date utilities
lucide-react → Icon library
```

### Internal Dependencies
```
App.tsx
  ├── imports components/* (all components)
  ├── imports lib/api.ts (data operations)
  ├── imports lib/calculations.ts (math)
  └── imports types/trade.ts (types)

TradeForm.tsx
  └── imports types/trade.ts

TradeTable.tsx
  ├── imports types/trade.ts
  └── imports lib/calculations.ts (formatters)

api.ts
  ├── imports lib/db.ts
  ├── imports lib/calculations.ts
  └── imports types/trade.ts
```

## Files by Size (Approximate)

```
Large (>200 lines):
- App.tsx (250 lines)
- lib/calculations.ts (180 lines)
- lib/api.ts (150 lines)
- components/TradeForm.tsx (160 lines)

Medium (100-200 lines):
- components/TradeTable.tsx (120 lines)
- components/StatsOverview.tsx (90 lines)

Small (<100 lines):
- All other component files
- Configuration files
- Type definitions
```

## Critical Files (Don't Delete!)

1. `prisma/schema.prisma` - Database schema
2. `src/lib/calculations.ts` - Trading logic
3. `src/lib/api.ts` - Data layer
4. `src/App.tsx` - Main app
5. `package.json` - Dependencies

## Auto-Generated Files (Safe to Delete)

- `node_modules/` - Run `npm install` to regenerate
- `dist/` - Run `npm run build` to regenerate
- `prisma/trading.db` - Run `npx prisma db push` to regenerate
- `.vite/` - Vite cache

---

**Total Lines of Code**: ~1,500 (excluding dependencies)  
**Total Files**: ~25 (excluding node_modules)  
**Bundle Size**: ~200KB (minified + gzipped)
