# Backend Setup Guide

The Trading Journal needs a backend server to handle database operations.

## Quick Setup

### 1. Update package.json
Replace your `package.json` with `package-updated.json`:
```bash
mv package-updated.json package.json
```

### 2. Install New Dependencies
```bash
npm install
```

This adds:
- `express` - Web server
- `cors` - Cross-origin requests
- `concurrently` - Run multiple commands

### 3. Update App.tsx
Replace the imports in `src/App.tsx`:

**Change this line:**
```typescript
import { 
  getAllTrades, 
  getTradesThisWeek, 
  getTradesThisMonth,
  createTrade,
  updateTrade,
  deleteTrade
} from './lib/api'
```

**To this:**
```typescript
import { 
  getAllTrades, 
  getTradesThisWeek, 
  getTradesThisMonth,
  createTrade,
  updateTrade,
  deleteTrade
} from './lib/api-client'
```

### 4. Make calculations.js Compatible
Copy calculations.ts to calculations.js:
```bash
cp src/lib/calculations.ts src/lib/calculations.js
```

### 5. Run Both Frontend and Backend
```bash
npm run dev:full
```

This starts:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

## Alternative: Run Separately

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## How It Works

```
Browser (localhost:5173)
    ↓ HTTP Requests
Backend API (localhost:3001)
    ↓ Prisma
SQLite Database (trading.db)
```

## Troubleshooting

### Port 3001 already in use
Change PORT in `server.js` and `src/lib/api-client.ts`

### CORS errors
Make sure backend is running first

### Module not found
Run `npm install` again
