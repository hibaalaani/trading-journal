# Trading Journal - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (2 min)
```bash
cd trading-journal
npm install
```

### Step 2: Create Database (30 sec)
```bash
npx prisma db push
```

### Step 3: Start App (30 sec)
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: **http://localhost:5173**

**Done!** You now have a professional trading journal running locally.

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npx prisma db push       # Update database schema
npx prisma studio        # Open database GUI (localhost:5555)

# Desktop App (Optional)
npm install -D @tauri-apps/cli
npm run tauri dev        # Run as desktop app
npm run tauri build      # Create executable
```

---

## 🎯 First Steps After Installation

1. **Click "Add Trade"** - Enter your first trade
2. **Explore Views** - Click "This Week", "This Month", "All Time"
3. **Check Stats** - See your metrics automatically calculate
4. **Edit Trade** - Click the ✏️ icon on any trade
5. **View Equity Curve** - See your account growth chart

---

## 💡 Quick Tips

### Adding a Trade
- **Date**: Trading date (defaults to today)
- **Asset**: Stock symbol (AAPL, TSLA) or crypto (BTC/USD)
- **Direction**: LONG = buy first, SHORT = sell first
- **Entry/Exit**: Your actual trade prices
- **Position Size**: Number of shares/units/contracts
- **Commission**: Total fees (will be deducted from profit)
- **Notes**: Optional - strategy, learnings, emotions

### Understanding Stats
- **Win Rate**: % of profitable trades
- **Net P/L**: Total profit after all commissions
- **Risk/Reward**: Average win ÷ average loss (higher is better)
- **Gross P/L**: Profit before commission deduction

### Keyboard Shortcuts
- `Ctrl/Cmd + Click` on "Add Trade" - Quick entry mode (coming soon)
- `Esc` - Close any modal

---

## 🔧 Troubleshooting

### "Port 5173 already in use"
```bash
npm run dev -- --port 3000
```

### Database Won't Create
```bash
# Delete and recreate
rm prisma/trading.db
npx prisma db push
```

### App Won't Start
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
# Usually fixed by reinstalling
npm install
```

---

## 📊 Example Trade Entry

**Scenario**: You bought 100 shares of AAPL at $150, sold at $155, paid $2 commission

1. Click "Add Trade"
2. Fill in:
   - Date: (select date)
   - Asset: `AAPL`
   - Direction: `LONG`
   - Entry Price: `150`
   - Exit Price: `155`
   - Position Size: `100`
   - Commission: `2`
   - Notes: "Strong earnings beat, sold at resistance"
3. Click "Add Trade"

**Automatic Calculations:**
- Gross P/L: $500 (because (155-150) × 100)
- Net P/L: $498 (because $500 - $2)
- Return %: +3.33% (because (155-150)/150 × 100)
- Result: WIN ✅

---

## 🎨 Customization Ideas

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  profit: '#10b981',  // Green for wins
  loss: '#ef4444',    // Red for losses
  background: '#0f172a',  // Dark background
}
```

### Add More Stats
Edit `src/lib/calculations.ts` to add custom metrics

### Change Starting Equity
In `src/components/EquityCurveChart.tsx`:
```typescript
calculateEquityCurve(trades, 2200)  // Change 10000 to your starting balance
```

---

## 📈 Sample Data (Optional)

Want to test with sample trades? Run this in Prisma Studio (`npx prisma studio`):

```sql
-- Add via Prisma Studio GUI or API calls
-- Example trades to populate your journal
```

Or use the app's "Add Trade" button - it's just as quick!

---

## 🚢 Next Steps

### For Desktop Use
1. Run app with `npm run dev`
2. Use daily for tracking
3. Data stored in `prisma/trading.db`

### For SaaS Business
1. Read `ARCHITECTURE.md`
2. Set up PostgreSQL database
3. Add authentication
4. Deploy frontend + backend
5. Integrate Stripe for billing

---

## 📞 Support

- Check `README.md` for full documentation
- Check `SETUP.md` for detailed installation
- Check `ARCHITECTURE.md` for technical details

---

**Happy Trading!** 📊💰

Remember: 
- Track EVERY trade
- Review statistics weekly
- Learn from losses
- Commission adds up - minimize it!
