# Deploy Trading Journal (Make It Global)

Get your app online so anyone can use it from a public URL.

---

## Option 1: One-Click Style (Railway or Render)

Deploy **frontend + API + SQLite** as a single app. Easiest.

### A) Railway

1. **Sign up**: [railway.app](https://railway.app) (GitHub login).

2. **New project from repo**  
   - “New Project” → “Deploy from GitHub repo”  
   - Select your repo.  
   - If the app lives in a subfolder (e.g. `trading-journal`), set **Root Directory** to `trading-journal`.

3. **Build & start**  
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push && npm run build`  
   - **Start Command:** `NODE_ENV=production npm run start`  
   - **Port:** Railway sets `PORT` automatically; leave it unset.

4. **Persistent database (recommended)**  
   - In the service → “Variables” add nothing extra for SQLite.  
   - To keep data across deploys: add a **Volume**, mount path `/app/prisma` (or where `prisma/trading.db` will live).  
   - Or later switch to **PostgreSQL**: add Railway Postgres, set `DATABASE_URL`, and change `prisma/schema.prisma` to use `postgresql` and `env("DATABASE_URL")`.

5. **Go live**  
   - “Settings” → “Generate Domain”. You get a URL like `https://your-app.up.railway.app`.  
   - Open it: the app and API are both served from that one URL (global).

### B) Render

1. **Sign up**: [render.com](https://render.com).

2. **New Web Service**  
   - Connect your GitHub repo.  
   - **Root Directory:** `trading-journal` if needed.

3. **Build & start**  
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push && npm run build`  
   - **Start Command:** `npx prisma db push && npm run start`  
   - Render sets `NODE_ENV=production` and `PORT` for you.

4. **Persistent disk (required for SQLite)**  
   - “Environment” → add a **Disk**: path **`prisma`** so `prisma/trading.db` is writable and persists. Without it, adding trades returns 500.

5. **Deploy**  
   - After deploy, use the URL Render gives you (e.g. `https://trading-journal-xyz.onrender.com`). That’s your global URL.

---

## Option 2: Your Own Server (VPS)

For a VPS (DigitalOcean, Linode, etc.):

1. **On the server** (Linux):

   ```bash
   git clone <your-repo-url>
   cd trading-journal   # or repo root if app is in subfolder
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   NODE_ENV=production PORT=3001 npm run start
   ```

2. **Keep it running** (e.g. with PM2):

   ```bash
   npm install -g pm2
   pm2 start "NODE_ENV=production PORT=3001 npm run start" --name trading-journal
   pm2 save && pm2 startup
   ```

3. **Put Nginx in front** (HTTPS + single port):

   - Nginx listens on 80/443 and proxies to `http://127.0.0.1:3001`.  
   - Or serve the app directly on port 80 (e.g. `PORT=80 npm run start` if run as root, or use a non-privileged port and proxy).

4. **Point a domain** at the server’s IP (or use the IP as your “global” URL).

---

## Environment Summary

| Variable         | When to set | Purpose |
|------------------|------------|---------|
| `PORT`           | Set by Railway/Render/VPS | Server listen port. |
| `NODE_ENV`       | Set to `production` on deploy | Enables serving built frontend and production behavior. |
| `VITE_API_URL`   | Only if frontend and API are on different domains | Full API base URL (e.g. `https://api.example.com/api`). |
| `DATABASE_URL`   | When using PostgreSQL | Replace SQLite; see `prisma/schema.prisma`. |

---

## After Deploy

- **Single-server deploy (Option 1 or 2):**  
  Open the one URL (e.g. `https://your-app.up.railway.app`). The site and API both work from that address (global).

- **Split deploy (frontend on Vercel, API elsewhere):**  
  Build the frontend with `VITE_API_URL=https://your-api-url/api`, deploy the built app to Vercel. Users open the Vercel URL; the app calls your API URL for data.

- **Database:**  
  SQLite is fine for one server and moderate use. For multiple instances or stronger durability, add PostgreSQL and set `DATABASE_URL` (and update `prisma/schema.prisma` and run `prisma migrate`).

You’re done: the app is deployed and reachable globally.
