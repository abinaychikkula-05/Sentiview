# 🔧 MongoDB Permission Fix Guide

## Problem
```
Error: "user is not allowed to do action [find] on [test.users]"
```

This means MongoDB is connected BUT the database user lacks proper permissions.

---

## Solution: Fix MongoDB Permissions

### Step 1: Go to MongoDB Atlas
1. Open https://cloud.mongodb.com
2. Login with your MongoDB Atlas account
3. Select your cluster (likely "Cluster0" or "cluster0")

### Step 2: Check Database User
1. Click **Database Access** (left sidebar)
2. Look for your database user (the one in your MONGODB_URI)
3. **Check the role** - it should have one of these:
   - ✅ `Atlas Admin` (best for development/production)
   - ✅ `readWriteAnyDatabase`
   - ✅ `dbOwner` on specific databases

If it only has `readWrite` on specific DB, it won't work.

### Step 3: Create New User with Admin Privileges (RECOMMENDED)

**If current user has limited permissions:**

1. Click **Add New Database User**
2. Fill in:
   - **Authentication Method:** Password
   - **Username:** `sentiview_prod` (any name you like)
   - **Password:** (Generate strong password - copy it!)
   - **Database User Privileges:** Choose **Built-in Role** → `Atlas Admin`
3. Click **Add User**

### Step 4: Get New Connection String

1. Go back to **Clusters**
2. Click **Connect** on your cluster
3. Choose **Drivers**
4. Copy the connection string
5. **Replace `<username>` and `<password>` with your new credentials**

**Example connection string:**
```
mongodb+srv://sentiview_prod:YOUR_PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
```

### Step 5: Update Railway

1. Go to https://railway.app/dashboard
2. Click **Sentiview** project
3. Click **Backend** service
4. Go to **Variables** tab
5. Find `MONGODB_URI`
6. **Replace with your new connection string**
7. Railway automatically restarts - wait 1-2 minutes

### Step 6: Test Login Again

```bash
curl -X POST https://airy-tranquility-production-da57.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sentiview.com","password":"admin123456"}'
```

Should see: `{"success":true,"token":"...","user":{"_id":"...","name":"Admin User","role":"admin"}}`

---

## If Still Getting Permission Error

### Check these:

1. **Database name is correct?**
   - Connection string should have database name at end: `...mongodb.net/sentiview`
   - Or MongoDB Atlas auto-selects if not specified

2. **User has proper role?**
   - Go back to Database Access
   - Click the user → Click Edit
   - Make sure role is `Atlas Admin` or higher

3. **Connection string has correct password?**
   - Special characters in password? (Must be URL-encoded)
   - Copy password again from Atlas "Password" field

4. **Wait a few minutes after updating**
   - Atlas can take 1-2 minutes to apply permission changes

---

## Quick Checklist

- [ ] I have MongoDB Atlas admin access
- [ ] I checked Database Access page
- [ ] Current user has proper role (Atlas Admin or readWriteAnyDatabase)
- [ ] OR I created a new user with Atlas Admin role
- [ ] I copied the connection string with correct credentials
- [ ] I updated MONGODB_URI in Railway Variables
- [ ] I waited 2 minutes for Railway to restart
- [ ] Login test now returns success

**Once login works, everything else will work!** 🎉

