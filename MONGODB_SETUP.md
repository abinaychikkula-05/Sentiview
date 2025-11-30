# MongoDB Setup Guide for SentiView

## Problem
The backend cannot connect to MongoDB because `MONGODB_URI` is not configured.

## Solution Options

### ✅ Option 1: MongoDB Atlas (Recommended - Cloud) - FOR PRODUCTION/RAILWAY

MongoDB Atlas is a free cloud database service. Follow these steps:

#### For Local Development:

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new project

2. **Create a Database Cluster**
   - Click "Create" to build a new cluster
   - Select "FREE" tier (M0 Sandbox)
   - Choose a region close to you
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster to be created

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `sentiview_user`
   - Password: Generate strong password (copy it!)
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (IMPORTANT for Railway)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Databases" and click "Connect"
   - Choose "Connect your application"
   - Copy the MongoDB URI string
   - Replace `<username>` with `sentiview_user`
   - Replace `<password>` with your generated password
   - Replace `myFirstDatabase` with `sentiview`
   - Final format:
   ```
   mongodb+srv://sentiview_user:YOUR_PASSWORD@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
   ```

6. **Update .env File (Local)**
   ```
   MONGODB_URI=mongodb+srv://sentiview_user:YOUR_PASSWORD@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority
   ```

#### For Railway Production:

1. Follow steps 1-5 above
2. Go to **Railway Dashboard**
3. Select your **SentiView Backend** project
4. Go to **Variables** tab
5. Add new variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://sentiview_user:YOUR_PASSWORD@cluster0.mongodb.net/sentiview?retryWrites=true&w=majority`
6. Save
7. Railway will auto-redeploy
8. Check logs for: `✅ MongoDB Connected`

### ✅ Option 2: MongoDB Community Edition (Local)

For Windows:
```bash
# Download from https://www.mongodb.com/try/download/community
# Run installer and follow prompts
# MongoDB will run as a service automatically

# Then update .env:
MONGODB_URI=mongodb://localhost:27017/sentiview
```

For Mac:
```bash
# Install via Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env:
MONGODB_URI=mongodb://localhost:27017/sentiview
```

For Linux:
```bash
# Follow: https://docs.mongodb.com/manual/administration/install-on-linux/

# Start MongoDB
sudo systemctl start mongod

# Update .env:
MONGODB_URI=mongodb://localhost:27017/sentiview
```

### ✅ Option 3: Docker (Easiest for Development)

```bash
# Make sure Docker is installed
docker --version

# Start MongoDB container
docker run -d \
  --name sentiview-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=sentiview \
  mongo:latest

# Update .env:
MONGODB_URI=mongodb://localhost:27017/sentiview

# To stop the container:
docker stop sentiview-mongo

# To start it again:
docker start sentiview-mongo
```

---

## Quick Test Steps

### 1. Update .env File
Edit `/workspaces/Sentiview/Backend/.env` and set your `MONGODB_URI`

### 2. Test Connection
```bash
cd Backend
npm start
```

### 3. Look for This Message
```
✅ MongoDB Connected: cluster0.mongodb.net
SentiView API running on port 5000
```

### 4. Test API Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "SentiView API is running",
  "timestamp": "2024-11-16T10:30:00.000Z"
}
```

---

## Troubleshooting

### Error: "connection refused"
- **Cause**: Local MongoDB not running
- **Solution**: Use MongoDB Atlas or start local MongoDB

### Error: "Authentication failed"
- **Cause**: Wrong username/password
- **Solution**: Check credentials in MongoDB Atlas dashboard

### Error: "Cannot connect to the Atlas cluster"
- **Cause**: IP not whitelisted
- **Solution**: Add your IP in Network Access (or use 0.0.0.0/0 for dev)

### Error: "Invalid connection string"
- **Cause**: Malformed URI
- **Solution**: Copy directly from MongoDB Atlas connection string page

---

## Free MongoDB Atlas Limits

✅ Free tier includes:
- Up to 5GB storage
- Unlimited connections
- Automatic backups
- 512MB per collection for analytics
- Perfect for development and testing

---

## After Connecting Successfully

Once connected, you can:

1. **Test the API:**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend (new terminal):**
   ```bash
   cd Frontend
   npm install
   npm start
   ```

3. **Access the App:**
   - Open http://localhost:3000
   - Register a new account
   - Upload sample CSV
   - View sentiment analysis

---

## Next Steps

1. Choose MongoDB setup option (Atlas recommended for easiest setup)
2. Get your connection string
3. Update `.env` file
4. Run `npm start` in Backend
5. Run `npm start` in Frontend
6. Test the application

For more help, see `README.md` or `DEVELOPMENT.md`
