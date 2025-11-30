# 🚀 Final Deployment Steps - SentiView

## Step 1: Get Your Railway Backend URL

Your backend is deployed on Railway. Here's how to find your URL:

### Method 1: From Railway Dashboard (EASIEST)
1. Go to https://railway.app/dashboard
2. Click on your **Sentiview** project
3. Look for the **Backend** service/deployment
4. Copy the domain URL (looks like: `https://sentiview-prod-******.up.railway.app`)

### Method 2: From Terminal (Alternative)
```bash
# If you have Railway CLI installed
railway domain
```

### Method 3: Check Environment Variables
If you set a custom domain in Railway, it will be shown in the Railway Variables section.

---

## Step 2: Test Your Backend URL

**Replace `YOUR_BACKEND_URL` with your actual Railway URL in the commands below:**

### Quick Test (Browser - Easiest)
1. Open your browser
2. Visit: `https://YOUR_BACKEND_URL/api/health`
3. You should see: `{"success":true,"message":"SentiView API is running","timestamp":"..."}`

### Terminal Test (curl)
```bash
curl https://YOUR_BACKEND_URL/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "SentiView API is running",
  "timestamp": "2025-11-30T..."
}
```

### Verify MongoDB Connection
```bash
curl https://YOUR_BACKEND_URL/api/auth/me
```
Should return error 401 (unauthorized) - this means backend is working! 
(We expect 401 because we're not logged in)

---

## Step 3: Update Frontend with Backend URL

### Edit Frontend/.env.production
```bash
# File location: /workspaces/Sentiview/Frontend/.env.production
```

**Replace this:**
```dotenv
REACT_APP_API_URL=https://your-backend-url.com
```

**With your actual Railway URL (Example):**
```dotenv
REACT_APP_API_URL=https://sentiview-prod-abc123.up.railway.app
```

### Important Notes:
- ✅ NO trailing slash after URL
- ✅ Must include `https://` (not http)
- ✅ Use your Railway URL, not localhost

---

## Step 4: Commit and Push to GitHub

This triggers Vercel to automatically redeploy with new backend URL:

```bash
cd /workspaces/Sentiview
git add Frontend/.env.production
git commit -m "Update: Backend URL for production deployment"
git push origin main
```

**Wait 2-3 minutes for Vercel to redeploy.**

---

## Step 5: Test Full Application

### Access Frontend
- URL: https://sentiview-ten.vercel.app

### Test Login
**Admin Account:**
- Email: `admin@sentiview.com`
- Password: `admin123456`

**Demo Account:**
- Email: `demo@sentiview.com`
- Password: `demo123456`

### Verify Features
1. ✅ **Login/Register** - Can you log in?
2. ✅ **Dashboard** - Do charts display with data?
3. ✅ **Sentiment Analysis** - Can you see Positive/Negative/Neutral breakdown?
4. ✅ **Upload Feedback** - Can you upload a CSV file?
5. ✅ **Admin Panel** - Can you access admin dashboard and see users?
6. ✅ **Dark Mode** - Toggle theme and verify styling
7. ✅ **Feedback List** - Can you see feedback items with sentiment?

### Troubleshooting
If you see "Failed to connect to backend":
1. Double-check backend URL in `.env.production` (no trailing slash)
2. Verify Railway backend is running: `https://YOUR_URL/api/health`
3. Check that `https://` is used (not `http://`)
4. Wait a few more minutes for Vercel redeploy to complete
5. Try clearing browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

---

## Complete Deployment Checklist

- [ ] Backend URL obtained from Railway
- [ ] Backend URL tested with `/api/health` endpoint
- [ ] Frontend `.env.production` updated
- [ ] Changes committed to GitHub
- [ ] Vercel redeploy completed (check Vercel dashboard)
- [ ] Frontend loads without errors
- [ ] Can login with admin credentials
- [ ] Dashboard displays charts and feedback
- [ ] Upload feature works
- [ ] Admin panel accessible
- [ ] All features functioning correctly

---

## Success! 🎉

When all tests pass, your SentiView application is fully deployed and operational!

**Production URLs:**
- Frontend: https://sentiview-ten.vercel.app
- Backend API: https://YOUR_BACKEND_URL/api
- MongoDB: Connected via Railway variables

**Documentation:**
- API Endpoints: See `API_TESTING.md`
- Deployment Info: See `DEPLOYMENT_GUIDE.md`
- MongoDB Help: See `MONGODB_TROUBLESHOOTING.md`
- Detailed Checklist: See `DEPLOYMENT_CHECKLIST.md`

---

## Quick Reference: What Each File Does

| File | Purpose |
|------|---------|
| Frontend/.env.production | Tells React where backend is (production) |
| Frontend/.env.development | Tells React where backend is (local dev) |
| Backend/src/server.js | Main backend server |
| Backend/src/config/database.js | MongoDB connection |
| Backend/railway.json | Tells Railway how to build/deploy |

