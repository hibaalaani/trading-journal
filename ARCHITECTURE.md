# Trading Journal - Technical Architecture Documentation

## System Overview

The Trading Journal is a full-stack TypeScript application designed as a local-first desktop app with a clear migration path to SaaS.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser/Desktop                      │
├─────────────────────────────────────────────────────────┤
│  React UI Layer (Components)                            │
│  ├── TradeForm    ├── TradeTable   ├── Charts          │
│  └── StatCards    └── StatsOverview                     │
├─────────────────────────────────────────────────────────┤
│  Business Logic Layer                                    │
│  ├── calculations.ts (Trading math)                     │
│  └── api.ts (Data access)                               │
├─────────────────────────────────────────────────────────┤
│  Data Layer (Prisma ORM)                                │
├─────────────────────────────────────────────────────────┤
│  SQLite Database (trading.db)                           │
└─────────────────────────────────────────────────────────┘
```

## Technology Decisions & Rationale

### 1. Frontend: React + TypeScript

**Why React?**
- Component reusability for complex UI
- Massive ecosystem for future features
- Easy to package as desktop or web app
- Strong community support

**Why TypeScript?**
- Type safety prevents calculation errors (critical for financial data)
- Better IDE autocomplete and refactoring
- Self-documenting code
- Catches bugs at compile time

### 2. Build Tool: Vite

**Why Vite?**
- 10-100x faster than Webpack
- Hot Module Replacement (instant updates)
- Optimized production builds
- Native ES modules support

**Alternatives Considered:**
- ❌ Create React App (deprecated, slow)
- ❌ Next.js (overkill for desktop, requires server)
- ✅ Vite (perfect for desktop apps)

### 3. Database: SQLite → PostgreSQL

**Why SQLite First?**
- Zero configuration
- Single file database
- Perfect for desktop apps
- No server required
- Extremely fast for < 1M records

**Migration Path to PostgreSQL:**
```prisma
// Current (desktop):
datasource db {
  provider = "sqlite"
  url      = "file:./trading.db"
}

// Future (SaaS):
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Why Prisma ORM?**
- Database-agnostic (easy migration)
- Type-safe queries
- Automatic migrations
- Excellent TypeScript integration
- Built-in connection pooling

### 4. Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first = rapid development
- Consistent design system
- Dark mode built-in
- Small production bundles (only used classes)
- No CSS naming conflicts

**Design System:**
```css
Colors:
- Background: #0f172a (dark blue-gray)
- Cards: #1e293b (lighter blue-gray)
- Profit: #10b981 (green)
- Loss: #ef4444 (red)
- Borders: #334155 (muted)
```

### 5. Charts: Recharts

**Why Recharts?**
- Built for React
- Declarative API
- Responsive by default
- Good performance
- Easy customization

**Alternatives:**
- ❌ Chart.js (imperative, harder in React)
- ❌ D3.js (steep learning curve)
- ✅ Recharts (perfect balance)

## Data Flow Architecture

### Trade Creation Flow

```
1. User fills TradeForm
   ↓
2. Form validation (client-side)
   ↓
3. handleAddTrade() in App.tsx
   ↓
4. createTrade() in api.ts
   ↓
5. calculateTradeMetrics() in calculations.ts
   ↓
6. Prisma creates record in SQLite
   ↓
7. loadTrades() refreshes UI
   ↓
8. All stats auto-recalculate
```

### Calculation Pipeline

```typescript
// Input
{ direction, entryPrice, exitPrice, positionSize, commission }

// Step 1: Gross P/L
grossPL = (direction === 'LONG')
  ? (exitPrice - entryPrice) × positionSize
  : (entryPrice - exitPrice) × positionSize

// Step 2: Net P/L
netPL = grossPL - commission

// Step 3: Return %
returnPercent = (direction === 'LONG')
  ? ((exitPrice - entryPrice) / entryPrice) × 100
  : ((entryPrice - exitPrice) / entryPrice) × 100

// Step 4: Classification
isWin = netPL > 0

// Stored in database for fast queries
```

## File Structure Deep Dive

### `/src/lib/` - Business Logic

**calculations.ts**
- Pure functions (no side effects)
- All trading math isolated
- Easy to test
- Reusable across components

**api.ts**
- All database operations
- Easy to convert to REST API
- Returns typed Trade objects
- Handles date filtering

**db.ts**
- Prisma client singleton
- Prevents multiple connections
- Development vs production handling

### `/src/components/` - UI Components

**Component Hierarchy:**
```
App.tsx (root)
├── TradeForm.tsx (modal)
├── StatCard.tsx × 4 (metrics)
├── TradeTable.tsx
│   └── Individual trade rows
├── EquityCurveChart.tsx
│   └── Recharts LineChart
└── StatsOverview.tsx
    └── Detailed stats grid
```

**Component Patterns:**
- Props for configuration
- State lifted to App.tsx
- Controlled forms
- Callback props for actions

### `/src/types/` - TypeScript Definitions

```typescript
// Domain models
type Trade
type TradeDirection
type TradeFormData

// View models
type DailyStats
type PeriodStats
type EquityPoint
```

## State Management

### Current: React useState + useEffect

**Why not Redux/Zustand?**
- App state is simple (list of trades)
- No complex async flows
- Direct API calls are sufficient
- Easier to understand

**State Location:**
```typescript
// App.tsx (root component)
const [trades, setTrades] = useState<Trade[]>([])
const [weekTrades, setWeekTrades] = useState<Trade[]>([])
const [monthTrades, setMonthTrades] = useState<Trade[]>([])
```

**Future Consideration:**
If app grows to 20+ components sharing state, consider:
- Zustand (lightweight)
- React Context + useReducer
- Redux Toolkit

## Performance Optimizations

### Database Indexing
```prisma
model Trade {
  date DateTime
  @@index([date])  // Fast date range queries
}
```

### Calculated Fields Stored
- Gross P/L, Net P/L, Return % calculated once
- Stored in database
- Avoids recalculation on every render

### React Optimizations
- Components don't re-render unnecessarily
- Event handlers use useCallback (if needed)
- Large lists could use react-window (future)

## Security Considerations

### Current (Desktop)
- All data local
- No network calls
- No authentication needed

### Future (SaaS)
- Implement JWT authentication
- Row-level security in PostgreSQL
- API rate limiting
- Input sanitization (Prisma handles SQL injection)
- HTTPS only

## Testing Strategy

### Unit Tests (Future)
```typescript
// calculations.test.ts
describe('calculateGrossPL', () => {
  it('calculates long position correctly', () => {
    expect(calculateGrossPL('LONG', 100, 110, 10))
      .toBe(100) // (110-100) * 10
  })
})
```

### Integration Tests
- Test API functions with test database
- Verify calculations with known trades
- Test edge cases (zero commission, etc.)

### E2E Tests (Future)
- Playwright or Cypress
- Test full user flows
- Automated UI testing

## Deployment Options

### Option 1: Desktop App (Tauri)
```bash
npm install -D @tauri-apps/cli
npm run tauri build
# Produces .exe, .dmg, or .AppImage
```

**Pros:**
- Single executable
- Native performance
- No internet required
- App store distribution

### Option 2: Web App (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

**Cons:**
- SQLite doesn't work in browser
- Need backend API

### Option 3: SaaS (Full Stack)

**Stack:**
- Frontend: Vercel/Netlify
- Backend: Node.js/Express on Railway/Render
- Database: PostgreSQL (Supabase/Neon)
- Auth: Clerk/Auth0

## Migration Roadmap to SaaS

### Phase 1: Multi-User Support
1. Add User model to schema
2. Add userId foreign key to Trade
3. Implement authentication
4. Filter trades by userId

### Phase 2: API Layer
```typescript
// Convert lib/api.ts to REST endpoints

// Before (direct Prisma):
await createTrade(data)

// After (HTTP API):
await fetch('/api/trades', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

### Phase 3: Backend Service
- Node.js/Express server
- PostgreSQL connection
- JWT authentication
- CORS configuration

### Phase 4: Subscription System
- Stripe integration
- Usage limits
- Feature flags
- Billing portal

## Scalability Considerations

### Current Limits
- SQLite: ~1M trades (more than enough)
- No pagination (could add)
- Single user

### Future Scaling
```typescript
// Add pagination
const trades = await getTradesByDateRange(
  startDate,
  endDate,
  { skip: page * 50, take: 50 }
)

// Add caching
const stats = useMemo(
  () => calculatePeriodStats(trades),
  [trades]
)
```

## Code Quality Standards

### TypeScript Rules
- Strict mode enabled
- No `any` types
- All functions typed
- Props interfaces defined

### Code Organization
- One component per file
- Logical file grouping
- Clear naming conventions
- Comments for complex logic

### Git Workflow
```bash
# Feature branches
git checkout -b feature/add-notes

# Commit messages
git commit -m "feat: add trade notes field"
git commit -m "fix: correct short position calculation"
```

## Future Enhancements

### Short Term
- [ ] Trade tags/categories
- [ ] Export to CSV
- [ ] Import from broker
- [ ] More chart types

### Medium Term
- [ ] Multi-account support
- [ ] Trade screenshots
- [ ] Custom metrics
- [ ] PDF reports

### Long Term
- [ ] Mobile app (React Native)
- [ ] AI trade analysis
- [ ] Social features
- [ ] Broker integrations

## Conclusion

This architecture provides:
✅ Fast local-first experience
✅ Type-safe development
✅ Easy SaaS migration
✅ Professional UX
✅ Scalable foundation

The design prioritizes:
1. **Developer Experience** - Easy to understand and modify
2. **User Experience** - Fast, intuitive, professional
3. **Future-Proofing** - Clear migration path
4. **Maintainability** - Clean code, good structure

---

**Architecture Version**: 1.0  
**Last Updated**: 2024  
**Author**: Senior Full-Stack Engineer
