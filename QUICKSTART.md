# SentiView - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your MongoDB URI:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentiview
# JWT_SECRET=your_secret_key_here

# Start the server
npm start
```

The backend API will be available at `http://localhost:5000`

### Step 2: Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will be available at `http://localhost:3000`

### Step 3: Test the Application

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Fill in the form and create an account
   - You'll be redirected to the dashboard

2. **Upload sample feedback:**
   - Click "Upload Feedback" button
   - Select the `Backend/sample-feedback.csv` file
   - View the sentiment analysis results

3. **Add feedback manually:**
   - Switch to "Add Manually" tab
   - Enter feedback text
   - Submit and see real-time sentiment analysis

4. **View analytics:**
   - Check the charts showing sentiment distribution
   - Filter by sentiment type
   - View overall metrics

## 📊 Sample Data

The `Backend/sample-feedback.csv` contains test data:

```csv
clientName,feedback,rating,category
John Smith,"Excellent service! The team was very responsive.",5,Customer Service
Sarah Johnson,"The product quality is outstanding.",5,Product Quality
Mike Davis,"Had some issues but support fixed it quickly.",4,Logistics
Emma Wilson,"Poor communication and delayed responses.",2,Customer Service
James Brown,"Great experience overall. Would definitely recommend.",5,General
```

## 🔑 Test Credentials

### Option 1: Create Your Own
1. Register at `/register`
2. Use your email and password

### Option 2: Default Test Account
```
Email: test@example.com
Password: password123
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `Backend/.env` | Backend configuration (create from `.env.example`) |
| `Backend/package.json` | Backend dependencies |
| `Backend/sample-feedback.csv` | Sample feedback data |
| `Frontend/package.json` | Frontend dependencies |
| `README.md` | Full documentation |

## 🛠 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env to 5001
```

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS setting in `Backend/src/server.js`
- Clear browser cache (Ctrl+Shift+Delete)

### MongoDB connection error
- Verify MongoDB URI in `.env`
- Check username and password
- Allow your IP in MongoDB Atlas network access

## 🎯 Features to Try

1. **Upload CSV** - Batch process feedback data
2. **Add Manual Entry** - Single feedback submission
3. **View Charts** - See sentiment visualizations
4. **Filter Feedback** - By sentiment type
5. **Delete Feedback** - Remove entries
6. **Analytics** - View trend data

## 📱 Responsive Design

The app works on:
- Desktop (1920px and up)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API endpoints
- CORS configuration
- Input validation

## 🚀 Production Deployment

Before deploying:

1. **Update .env:**
   ```
   NODE_ENV=production
   JWT_SECRET=strong_random_string
   MONGODB_URI=production_uri
   ```

2. **Build frontend:**
   ```bash
   cd Frontend
   npm run build
   ```

3. **Run backend in production:**
   ```bash
   cd Backend
   npm start
   ```

## 📞 Support

If you encounter issues:
1. Check the `README.md` for detailed documentation
2. Review error messages in the browser console
3. Check backend logs in the terminal
4. Verify all `.env` variables are set correctly

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Chart.js Guide](https://www.chartjs.org)

---

**Happy analyzing! 📈**
