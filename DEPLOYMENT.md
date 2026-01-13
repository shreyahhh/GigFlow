# Deployment Guide - GigFlow

This guide covers deploying GigFlow to Vercel (Frontend) and a backend hosting service.

## 🎯 Deployment Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway, Render, or similar (Node.js + Express)
- **Database**: MongoDB Atlas (Cloud)

## 📋 Prerequisites

1. GitHub account
2. Vercel account (free tier works)
3. Backend hosting account (Railway/Render - free tier available)
4. MongoDB Atlas account (free tier available)

---

## 🚀 Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. **Sign up** at [railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository** and choose the `server` folder
4. **Add Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. **Deploy** - Railway will automatically detect Node.js and deploy
6. **Copy your Railway URL** (e.g., `https://gigflow-backend.railway.app`)

### Option B: Render

1. **Sign up** at [render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** and select your repo
4. **Configure**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Add Environment Variables** (same as Railway)
6. **Deploy** and copy your Render URL

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to client directory**:
   ```bash
   cd client
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts
   - Select default settings
   - When asked for environment variables, add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     VITE_SOCKET_URL=https://your-backend-url.railway.app
     ```

5. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Go to** [vercel.com](https://vercel.com) and sign in
2. **Import Project** → **Import Git Repository**
3. **Select your GitHub repository**
4. **Configure Project**:
   - **Root Directory**: `client` (click "Edit" and set to `client`)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables**:
   - Click **Environment Variables**
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.railway.app
     VITE_SOCKET_URL = https://your-backend-url.railway.app
     ```
   - Select **Production**, **Preview**, and **Development**

6. **Deploy** → Click **Deploy**

---

## ⚙️ Step 3: Update Backend CORS

After deploying frontend, update your backend environment variables:

1. **Go to your backend hosting** (Railway/Render)
2. **Update Environment Variables**:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. **Redeploy** the backend

---

## 🔧 Step 4: Update MongoDB Atlas

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Network Access** → **Add IP Address**
3. **Add** `0.0.0.0/0` (allow all IPs) or your hosting IPs
4. **Database Access** → Ensure your user has read/write permissions

---

## ✅ Step 5: Verify Deployment

1. **Visit your Vercel URL** (e.g., `https://gigflow.vercel.app`)
2. **Test Features**:
   - ✅ User registration
   - ✅ User login
   - ✅ Create gig
   - ✅ Place bid
   - ✅ Hire freelancer
   - ✅ Real-time notifications

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that backend CORS allows your Vercel domain

### API Not Working
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend logs for errors
- Ensure backend is running and accessible

### Socket.io Not Working
- Verify `VITE_SOCKET_URL` in Vercel environment variables
- Check that Socket.io server is running on backend
- Ensure WebSocket connections are allowed by hosting provider

### Environment Variables Not Loading
- In Vercel, ensure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check Vercel build logs for errors

---

## 📝 Environment Variables Summary

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## 🔗 Quick Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## ✨ Post-Deployment

1. **Update README.md** with live URLs
2. **Test all features** thoroughly
3. **Monitor logs** for any errors
4. **Set up custom domain** (optional)

---

**Need Help?** Check the logs in your hosting provider's dashboard for detailed error messages.

