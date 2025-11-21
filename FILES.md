# SentiView - Complete File Index

## 📑 Quick Navigation Guide

### 📚 Documentation Files (Read First)
1. **QUICKSTART.md** - Start here! 5-minute setup guide
2. **README.md** - Comprehensive project documentation
3. **API_TESTING.md** - API endpoints and testing guide
4. **DEVELOPMENT.md** - Development workflow and best practices
5. **PROJECT_SUMMARY.md** - Project completion summary

---

## 🏗 Backend Files

### Configuration
- **Backend/.env.example** - Environment template (copy to .env)
- **Backend/package.json** - Dependencies and scripts

### Main Application
- **Backend/src/server.js** - Express server setup and middleware

### Database Configuration
- **Backend/src/config/database.js** - MongoDB connection

### Data Models
- **Backend/src/models/User.js** - User schema (username, email, password)
- **Backend/src/models/Feedback.js** - Feedback schema (text, sentiment, rating)

### Controllers (Business Logic)
- **Backend/src/controllers/authController.js** - Register, login, get user
- **Backend/src/controllers/feedbackController.js** - CRUD operations, sentiment analysis

### Middleware
- **Backend/src/middleware/auth.js** - JWT verification and token generation
- **Backend/src/middleware/errorHandler.js** - Centralized error handling

### Routes
- **Backend/src/routes/auth.js** - `/api/auth/*` endpoints
- **Backend/src/routes/feedback.js** - `/api/feedback/*` endpoints

### Services
- **Backend/src/services/sentimentService.js** - Sentiment analysis logic

### Sample Data
- **Backend/sample-feedback.csv** - Test data for upload feature
- **Backend/uploads/** - Directory for uploaded CSV files

---

## 🎨 Frontend Files

### Configuration
- **Frontend/.env.example** - Environment template
- **Frontend/package.json** - Dependencies and scripts

### HTML & Entry Points
- **Frontend/public/index.html** - HTML template
- **Frontend/src/index.js** - React entry point
- **Frontend/src/index.css** - Global styles

### Main App
- **Frontend/src/App.js** - Main component with routing
- **Frontend/src/App.css** - App-specific styles

### Pages (Full-page components)
- **Frontend/src/pages/Login.js** - Login page
- **Frontend/src/pages/Register.js** - Registration page
- **Frontend/src/pages/Dashboard.js** - Main dashboard

### Components (Reusable UI components)
- **Frontend/src/components/UploadFeedback.js** - CSV upload and manual entry
- **Frontend/src/components/FeedbackList.js** - Feedback display list
- **Frontend/src/components/SentimentCharts.js** - Charts and analytics

### State Management
- **Frontend/src/context/AuthContext.js** - Authentication context and hooks

### Services (API calls)
- **Frontend/src/services/feedbackService.js** - All feedback API calls

### Utilities
- **Frontend/src/utils/helpers.js** - Helper functions (formatting, colors)

### Styles
- **Frontend/src/styles/Auth.css** - Login/Register page styles
- **Frontend/src/styles/Dashboard.css** - Dashboard layout styles
- **Frontend/src/styles/Components.css** - Component-specific styles

---

## 📋 File Organization Summary

```
Sentiview/
│
├── Documentation/
│   ├── README.md ..................... Complete documentation
│   ├── QUICKSTART.md ................ 5-minute setup
│   ├── API_TESTING.md ............... API guide
│   ├── DEVELOPMENT.md ............... Dev guide
│   ├── PROJECT_SUMMARY.md ........... Summary
│   └── FILES.md ..................... This file
│
├── Backend/
│   ├── package.json ................. Dependencies
│   ├── .env.example ................. Config template
│   ├── sample-feedback.csv .......... Test data
│   │
│   ├── src/
│   │   ├── server.js ................ Express app
│   │   │
│   │   ├── config/
│   │   │   └── database.js ......... MongoDB setup
│   │   │
│   │   ├── models/
│   │   │   ├── User.js ............ User schema
│   │   │   └── Feedback.js ........ Feedback schema
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js .. Auth logic
│   │   │   └── feedbackController.js Feedback logic
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js ............ JWT auth
│   │   │   └── errorHandler.js ... Error handling
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js ............ Auth routes
│   │   │   └── feedback.js ........ Feedback routes
│   │   │
│   │   ├── services/
│   │   │   └── sentimentService.js Sentiment analysis
│   │   │
│   │   └── utils/
│   │
│   └── uploads/ .................... Uploaded files
│
└── Frontend/
    ├── package.json ................. Dependencies
    ├── .env.example ................. Config template
    │
    ├── public/
    │   └── index.html .............. HTML template
    │
    └── src/
        ├── index.js ................ Entry point
        ├── index.css ............... Global styles
        ├── App.js .................. Main component
        ├── App.css ................. App styles
        │
        ├── pages/
        │   ├── Login.js ............ Login page
        │   ├── Register.js ......... Register page
        │   └── Dashboard.js ........ Dashboard page
        │
        ├── components/
        │   ├── UploadFeedback.js ... Upload component
        │   ├── FeedbackList.js ..... List component
        │   └── SentimentCharts.js .. Charts component
        │
        ├── context/
        │   └── AuthContext.js ...... Auth context
        │
        ├── services/
        │   └── feedbackService.js .. API client
        │
        ├── utils/
        │   └── helpers.js .......... Utilities
        │
        └── styles/
            ├── Auth.css ........... Auth styles
            ├── Dashboard.css ..... Dashboard styles
            └── Components.css .... Component styles
```

---

## 🚀 File Purpose Quick Reference

### If you want to...

**Understand the project**
→ Read `QUICKSTART.md` then `README.md`

**Test the API**
→ Read `API_TESTING.md` and use `Backend/sample-feedback.csv`

**Modify authentication**
→ Edit `Backend/src/controllers/authController.js`

**Change sentiment analysis**
→ Edit `Backend/src/services/sentimentService.js`

**Update database schema**
→ Edit `Backend/src/models/User.js` or `Feedback.js`

**Modify frontend UI**
→ Edit files in `Frontend/src/components/`

**Change styling**
→ Edit files in `Frontend/src/styles/`

**Add new API endpoint**
→ Create in `Backend/src/routes/`, add controller, update `API_TESTING.md`

**Configure for production**
→ Update `.env` files and review `DEVELOPMENT.md`

---

## 📊 File Statistics

| Category | Count | Total Lines |
|----------|-------|------------|
| Backend JavaScript | 11 files | ~1,500 lines |
| Frontend JavaScript | 11 files | ~1,200 lines |
| CSS Files | 4 files | ~600 lines |
| HTML Files | 1 file | ~10 lines |
| Configuration | 4 files | ~150 lines |
| Documentation | 5 files | ~2,000 lines |
| Sample Data | 1 file | ~10 lines |
| **TOTAL** | **37 files** | **~5,500 lines** |

---

## 📖 Reading Order (Recommended)

1. **QUICKSTART.md** (5 min) - Get setup running
2. **README.md** (15 min) - Understand architecture
3. **API_TESTING.md** (10 min) - Learn endpoints
4. **DEVELOPMENT.md** (20 min) - Understand development
5. **Individual files** - As needed for modifications

---

## 🔍 File Dependencies

### Backend
```
server.js
  → config/database.js (MongoDB setup)
  → routes/auth.js
    → controllers/authController.js
      → models/User.js
      → middleware/auth.js
  → routes/feedback.js
    → controllers/feedbackController.js
      → models/Feedback.js
      → services/sentimentService.js
      → middleware/auth.js
  → middleware/errorHandler.js
```

### Frontend
```
index.js
  → App.js
    → context/AuthContext.js
    → pages/Login.js
    → pages/Register.js
    → pages/Dashboard.js
      → components/UploadFeedback.js
        → services/feedbackService.js
      → components/FeedbackList.js
        → utils/helpers.js
      → components/SentimentCharts.js
    → styles/*.css
```

---

## ✨ Key Highlights

### Most Important Files
1. **Backend/src/server.js** - The Express app
2. **Frontend/src/App.js** - React routing
3. **Backend/src/services/sentimentService.js** - Core logic
4. **Frontend/src/pages/Dashboard.js** - Main UI

### Configuration Files
- `Backend/.env.example` - Must be copied to `.env`
- `Frontend/.env.example` - Optional frontend config
- `Backend/package.json` - All npm dependencies

### Documentation
- Start with `QUICKSTART.md`
- Reference `API_TESTING.md` for endpoints
- Check `DEVELOPMENT.md` for customization

---

## 🛠 Common Tasks - File Locations

| Task | File to Edit |
|------|-------------|
| Add database field | `Backend/src/models/*.js` |
| Create new endpoint | `Backend/src/routes/*.js` + controller |
| Fix UI bug | `Frontend/src/components/*.js` or `styles/*.css` |
| Change colors | `Frontend/src/index.css` (CSS variables) |
| Update sentiments | `Backend/src/services/sentimentService.js` |
| Add validation | `Backend/src/controllers/*.js` |
| Modify charts | `Frontend/src/components/SentimentCharts.js` |
| Change auth logic | `Backend/src/controllers/authController.js` |

---

## 📞 Support Resources

- **Setup Issues**: See `QUICKSTART.md`
- **API Questions**: See `API_TESTING.md`
- **Development Help**: See `DEVELOPMENT.md`
- **Architecture Questions**: See `README.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

---

**Project Version**: 1.0.0  
**Created**: November 2024  
**Status**: Complete and Ready to Use
