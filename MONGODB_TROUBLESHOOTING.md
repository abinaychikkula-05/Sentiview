# 🔧 MongoDB Connection Troubleshooting - STEP BY STEP

## Current Error
```
❌ Error connecting to MongoDB: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
ERROR: MongoDB connection required in production!
```

This means: **Railway can't reach MongoDB Atlas**

---

## ✅ Solution Checklist

### Step 1: Verify MongoDB Atlas Account
- [ ] Open https://mongodb.com/cloud/atlas
- [ ] Login to your account
- [ ] You should see your cluster (if you created one)
- [ ] If not, CREATE a new cluster:
  - Click "Create"
  - Select "M0 Sandbox" (FREE)
  - Click "Create Cluster"
  - Wait 5-10 minutes

---

### Step 2: Create Database User (if not done)
- [ ] In MongoDB Atlas, go to **"Database Access"** (left menu)
- [ ] Click **"Add Database User"**
- [ ] Username: `sentiview_user`
- [ ] Password: Create strong password (copy it!)
- [ ] Click **"Add User"**

**Example password**: `MyP@ssw0rd123!789`

---

### Step 3: Get Connection String
- [ ] Go to **"Clusters"** in MongoDB Atlas
- [ ] Click **"Connect"** button
- [ ] Choose **"Connect your application"**
- [ ] Select **Node.js 4.1 or later**
- [ ] Copy the connection string

**It will look like:**
```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

---

### Step 4: Modify Connection String
The default string needs ONE change - add the database name `/sentiview`:

**BEFORE:**
```
mongodb+srv://sentiview_user:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
```

**AFTER:**
```
mongodb+srv://sentiview_user:PASSWORD@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
```

Notice: Added `/sentiview` after `.mongodb.net`

---

### Step 5: Replace PASSWORD
Replace `PASSWORD` with your actual password (the one you created in Step 2)

**Example with password `MyP@ssw0rd123!789`:**
```
mongodb+srv://sentiview_user:MyP@ssw0rd123!789@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
```

⚠️ **IMPORTANT**: If your password has special characters, you may need to URL encode them:
- `@` → `%40`
- `!` → `%21`
- `#` → `%23`

**Example encoded:**
```
mongodb+srv://sentiview_user:MyP%40ssw0rd123%21789@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
```

---

### Step 6: Allow Network Access
- [ ] In MongoDB Atlas, go to **"Network Access"** (left menu)
- [ ] Click **"Add IP Address"**
- [ ] Click **"Allow Access from Anywhere"**
- [ ] Click **"Confirm"**

This allows Railway (and any server) to connect to your database.

---

### Step 7: Add to Railway
- [ ] Go to **railway.app**
- [ ] Login
- [ ] Select your **SentiView Backend** project
- [ ] Go to **"Variables"** tab
- [ ] Look for existing `MONGODB_URI` variable
  - If it exists, **DELETE it**
  - Then create a new one
- [ ] Click **"New Variable"**
- [ ] Name: `MONGODB_URI`
- [ ] Value: Paste your complete connection string (from Step 5)
- [ ] Click **"Add"**
- [ ] Click **"Save"**

---

### Step 8: Redeploy on Railway
- [ ] Go to **"Deployments"** in Railway
- [ ] Click the **"..."** menu on latest deployment
- [ ] Click **"Redeploy"**
- [ ] Wait for green checkmark ✅

---

### Step 9: Check Logs
- [ ] Still in **"Deployments"**
- [ ] Click on the deployment to see logs
- [ ] Scroll down to find one of these messages:

**SUCCESS** (what you want to see):
```
✅ MongoDB Connected: cluster0.mongodb.net
SentiView API running on port 5000
```

**ERROR** (something wrong):
```
❌ MongoDB Connection Error: ...
```

---

## 🚨 If Still Failing

### Error: "Authentication failed"
**Cause**: Wrong password or username

**Fix**:
1. Go to MongoDB Atlas → **Database Access**
2. Find your user `sentiview_user`
3. Click **"Edit"** → Edit Password
4. Generate new password
5. Copy it and update Railway `MONGODB_URI`

### Error: "connect ENOTFOUND"
**Cause**: IP whitelist not set or network issue

**Fix**:
1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Wait 2-3 minutes for it to take effect
6. Redeploy Railway

### Error: "Cannot find user"
**Cause**: User doesn't exist in MongoDB

**Fix**:
1. Go to MongoDB Atlas → **Database Access**
2. Verify user `sentiview_user` exists
3. If not, click **"Add Database User"**
4. Create it with username `sentiview_user`

### Error: "Timed out"
**Cause**: Connection taking too long (network issue)

**Fix**:
1. Wait 2-3 minutes
2. Check your internet
3. Redeploy Railway
4. Try again

---

## 📝 Complete Example Setup

If you're starting fresh, here's the EXACT sequence:

1. MongoDB Atlas:
   - Username: `sentiview_user`
   - Password: `SecurePassword123!` (use your own strong one)
   - Database name: `sentiview`
   - IP: `0.0.0.0/0` (Allow from anywhere)

2. Connection String:
   ```
   mongodb+srv://sentiview_user:SecurePassword123!@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
   ```

3. Railway Variables:
   - `MONGODB_URI` = (paste above string)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (random 20+ char string)

4. Redeploy → Check logs → Should see ✅

---

## ✅ Success Indicators

You'll know it's working when you see in Railway logs:
```
🔄 Attempting to connect to MongoDB...
Connection string format: mongodb+srv://sentiview_user:***@cluster0.mongodb.net/s...
✅ MongoDB Connected: cluster0.mongodb.net
SentiView API running on port 5000
```

Then test with:
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

## 🆘 Still Not Working?

**Try this in order:**

1. [ ] Delete `MONGODB_URI` variable from Railway
2. [ ] Wait 1 minute
3. [ ] Add it back with correct string
4. [ ] Wait 2 minutes after saving
5. [ ] Redeploy
6. [ ] Check logs
7. [ ] If still failing, check MongoDB Atlas:
   - User exists?
   - Password correct?
   - Network access set to 0.0.0.0/0?
   - Cluster created?

---

## 💡 Quick Test Locally

To verify your connection string works:

```bash
cd /workspaces/Sentiview/Backend
export MONGODB_URI="your-connection-string-here"
npm start
```

If it works locally, it will work on Railway!

---

**Follow these steps exactly and you'll get connected! 🚀**

Need help? Check the logs in Railway Deployments - they show exactly what's wrong!
