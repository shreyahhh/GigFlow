# Quick Vercel Deployment Guide

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Prepare Your Repository
1. Push all code to GitHub: `https://github.com/shreyahhh/GigFlow`
2. Ensure all files are committed

### Step 2: Deploy Backend First (Railway/Render)

**Railway (Recommended):**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repo → Choose `server` folder
4. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key_min_32_chars
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://gigflow.vercel.app
   ```
5. Copy your Railway URL (e.g., `https://gigflow-backend.railway.app`)

### Step 3: Deploy Frontend to Vercel

**Option A: Vercel Dashboard (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. **Add New Project** → Import Git Repository
3. Select `shreyahhh/GigFlow`
4. **Configure:**
   - **Root Directory**: `client` (click Edit, change to `client`)
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables:**
   - `VITE_API_URL` = `https://your-railway-url.railway.app`
   - `VITE_SOCKET_URL` = `https://your-railway-url.railway.app`
6. Click **Deploy**

**Option B: Vercel CLI**
```bash
cd client
npm i -g vercel
vercel login
vercel
# Follow prompts, add env vars when asked
vercel --prod
```

### Step 4: Update Backend CORS
1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy backend

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

## 🔍 Troubleshooting

**Build Fails:**
- Check Vercel build logs
- Ensure root directory is set to `client`
- Verify all dependencies in `client/package.json`

**API Not Working:**
- Check `VITE_API_URL` in Vercel env vars
- Verify backend is running
- Check CORS settings in backend

**Socket.io Not Working:**
- Check `VITE_SOCKET_URL` in Vercel env vars
- Verify WebSocket support on backend host

---

**Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.


