# Railway Backend Deployment Fix

## Problem
Getting npm install error: "Cannot read property 'bcryptjs' of undefined"

## Solution Applied

✅ **Cleaned and reinstalled dependencies**:
- Removed corrupted `node_modules/`
- Removed old `package-lock.json`
- Fresh `npm install`
- Created `.npmrc` configuration

## Deploying to Railway - Step by Step

### 1. Prepare GitHub
```bash
cd /workspaces/Sentiview
git add -A
git commit -m "Fix: Clean npm dependencies for Railway deployment"
git push origin main
```

### 2. Connect Backend to Railway

1. Go to **railway.app**
2. Click **New Project** → **GitHub Repo**
3. Select your **Sentiview repository**
4. **Add Service** → Select the **Backend folder** path:
   - Source: `./Backend`
5. **Deploy**

### 3. Configure Environment Variables in Railway

In Railway dashboard, go to your project → Variables:

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/sentiview
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

**Get MongoDB URI:**
1. Go to **mongodb.com/cloud/atlas**
2. Create free account
3. Create cluster
4. Create database user
5. Get connection string from "Connect" button

### 4. Wait for Deploy

Railway will:
- Pull code from GitHub
- Install dependencies with `npm ci`
- Run `npm start`
- Assign you a public URL

### 5. Get Your Backend URL

Once deployed, you'll see a URL like:
```
https://sentiview-backend-production.railway.app
```

### 6. Update Frontend

In `/workspaces/Sentiview/Frontend/.env.production`:
```
REACT_APP_API_URL=https://sentiview-backend-production.railway.app
```

### 7. Push & Vercel Auto-Redeploys

```bash
git add Frontend/.env.production
git commit -m "Update backend URL for production"
git push
```

---

## Files That Were Fixed

✅ `Backend/package.json` - Cleaned and reinstalled
✅ `Backend/package-lock.json` - Recreated
✅ `Backend/.npmrc` - Added for better npm handling
✅ `Backend/node_modules/` - Cleaned

---

## If Error Still Occurs in Railway

### Check the build logs:
1. Go to Railway → Your Project → Deployments
2. Click on failed deployment
3. Check **Build Logs** for specific error
4. Common fixes:
   - Clear Railway cache: Redeploy settings
   - Update Node version: Set `NODE_VERSION=18` in variables

### Manual Fix:
1. Clone locally
2. Run: `npm ci --legacy-peer-deps`
3. Commit `package-lock.json`
4. Push to GitHub
5. Redeploy on Railway

---

## Testing Backend Deployment

Once deployed, test the API:

```bash
curl https://your-railway-url/api/health
```

Should return:
```json
{
  "success": true,
  "message": "SentiView API is running",
  "timestamp": "2025-11-30T15:00:00.000Z"
}
```

---

## Next Steps

1. ✅ Push cleaned code to GitHub
2. ✅ Connect Backend to Railway
3. ✅ Configure environment variables
4. ✅ Get backend URL from Railway
5. ✅ Update frontend `.env.production`
6. ✅ Vercel auto-redeploys
7. ✅ Test full application

**You're all set for production! 🚀**
