# SentiView Deployment Guide

## Current Architecture

**Frontend**: Deployed on Vercel (public)
**Backend**: Needs to be deployed on a server (e.g., Railway, Render, Heroku, etc.)

---

## Step 1: Deploy Backend to Railway/Render

### Option A: Using Railway.app (Recommended)

1. **Sign up at railway.app** (free with GitHub)
2. **Create a new project** → Select "MongoDB" from templates
3. **Add Node.js service**:
   - Click "Add Service" → "GitHub Repo"
   - Select your SentiView backend repo
4. **Set environment variables** in Railway:
   ```
   MONGODB_URI=<from Railway MongoDB service>
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```
5. **Deploy** - Railway will auto-deploy when you push to GitHub

### Option B: Using Render.com

1. **Sign up at render.com**
2. **Create New** → **Web Service**
3. **Connect GitHub repo** (select Backend folder)
4. **Configure**:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add environment variables** (same as above)
6. **Create PostgreSQL/MongoDB service** separately
7. **Deploy**

---

## Step 2: Get Your Backend URL

After deployment, you'll get a URL like:
```
https://sentiview-backend.railway.app
```

---

## Step 3: Update Frontend Environment Variables

In `/workspaces/Sentiview/Frontend/.env.production`:

```
REACT_APP_API_URL=https://sentiview-backend.railway.app
```

In `/workspaces/Sentiview/Frontend/.env.development`:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## Step 4: Deploy Frontend to Vercel

1. **Push your code to GitHub** with the updated `.env` files
2. **Go to vercel.com** → Import Project
3. **Select your GitHub repo**
4. **Set Framework**: React
5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
6. **Deploy**

---

## Step 5: Backend CORS Configuration

Make sure your backend has CORS enabled for your Vercel domain.

In `/workspaces/Sentiview/Backend/src/server.js`, ensure CORS is configured:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
}));
```

---

## Testing Deployed Application

1. Go to `https://your-vercel-app.vercel.app`
2. Try logging in with:
   - Email: `admin@sentiview.com`
   - Password: `admin123456`
3. Check browser console (F12) for any CORS or 405 errors
4. If getting 405 errors, backend URL is wrong - double-check `.env.production`

---

## Common Issues & Fixes

### 405 Method Not Allowed
- **Cause**: Frontend calling wrong URL or backend not deployed
- **Fix**: Check `REACT_APP_API_URL` in `.env.production`

### CORS Error
- **Cause**: Backend CORS not configured for Vercel domain
- **Fix**: Update CORS in backend server.js with your Vercel domain

### Database Empty
- **Cause**: Production database not seeded
- **Fix**: 
  - For Railway: Run seed script in terminal
  - Or create seed endpoint in backend

### Slow API Response
- **Cause**: Railway free tier has cold starts
- **Fix**: Upgrade to paid tier or add more resources

---

## Production MongoDB Setup

For production, use MongoDB Atlas (free tier available):

1. Go to **mongodb.com/cloud/atlas**
2. Create free cluster
3. Create database user
4. Get connection string
5. Set `MONGODB_URI` environment variable in Railway/Render

---

## Environment Variables Summary

### Backend
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sentiview
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.com
```

---

## File Changes Made

All frontend files have been updated to use `REACT_APP_API_URL`:
- ✅ `Frontend/src/context/AuthContext.js`
- ✅ `Frontend/src/services/feedbackService.js`
- ✅ `Frontend/src/pages/AdminPage.js`
- ✅ `.env.production` (created)
- ✅ `.env.development` (created)

---

## Next Steps

1. Choose a backend hosting service (Railway/Render)
2. Deploy backend and get URL
3. Update `.env.production` with backend URL
4. Push to GitHub
5. Vercel will auto-redeploy with new environment variables
6. Test the deployed app

Good luck! 🚀
