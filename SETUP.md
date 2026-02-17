# Trading Journal - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** - Download from https://nodejs.org/
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

## Step-by-Step Installation

### 1. Install Node.js (if not already installed)

**Windows:**
- Download installer from https://nodejs.org/
- Run installer and follow prompts
- Verify: Open Command Prompt and run `node --version`

**macOS:**
```bash
brew install node
# Or download from https://nodejs.org/
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Navigate to Project Directory

```bash
cd trading-journal
```

### 3. Install Dependencies

This will install all required packages:

```bash
npm install
```

Expected output:
- Downloads ~200MB of dependencies
- Takes 1-3 minutes
- No errors should appear

### 4. Initialize Database

Create the SQLite database:

```bash
npx prisma db push
```

Expected output:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

This creates `prisma/trading.db` file.

### 5. Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Open in Browser

Navigate to: **http://localhost:5173**

You should see the Trading Journal dashboard!

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in PATH
- Reinstall Node.js or restart your terminal

### "prisma: command not found"
- Run: `npm install` first
- Use: `npx prisma db push` (with npx prefix)

### Port 5173 already in use
- Another app is using the port
- Kill the process or use: `npm run dev -- --port 3000`

### Database errors
- Delete `prisma/trading.db` file
- Run `npx prisma db push` again

### TypeScript errors
- Run: `npm install` again
- Delete `node_modules/` and reinstall

## File Locations

After setup, your directory should look like:

```
trading-journal/
├── node_modules/          # Dependencies (auto-generated)
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── trading.db         # Your data (auto-generated)
├── src/                   # Application code
├── dist/                  # Built app (after npm run build)
└── package.json
```

## Database Management

### View Database
```bash
npx prisma studio
```
Opens web interface at http://localhost:5555

### Backup Database
Simply copy the file:
```bash
cp prisma/trading.db prisma/trading-backup.db
```

### Reset Database
⚠️ This deletes all data:
```bash
rm prisma/trading.db
npx prisma db push
```

## Building for Production

### Create Optimized Build
```bash
npm run build
```

Output in `dist/` folder.

### Test Production Build
```bash
npm run preview
```

## Next Steps

### For Desktop App (Optional)

Install Tauri:
```bash
npm install -D @tauri-apps/cli
npm run tauri init
```

Follow prompts, then:
```bash
npm run tauri dev     # Run desktop app
npm run tauri build   # Build executable
```

### For SaaS Version (Future)

1. Set up PostgreSQL database
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Add authentication (NextAuth.js, Auth0, etc.)
4. Convert API functions to REST endpoints
5. Deploy to Vercel/Railway/Render

## Support

If you encounter issues:
1. Check Node.js version: `node --version` (should be 18+)
2. Delete `node_modules/` and run `npm install` again
3. Check browser console for errors (F12)
4. Verify database file exists: `ls prisma/trading.db`

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npx prisma studio    # Open database GUI
npx prisma db push   # Update database schema
```

## Security Notes

- Database is stored locally in `prisma/trading.db`
- No internet connection required
- Your trading data never leaves your computer
- For cloud version, implement proper authentication

## Performance

- Fast startup (~1 second)
- Instant trade entry
- Handles 10,000+ trades easily
- SQLite is optimized for desktop use

---

**Ready to track your trades!** 🚀
