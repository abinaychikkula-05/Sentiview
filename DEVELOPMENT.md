# SentiView - Development Guide

## Project Structure Overview

### Backend Architecture

```
Backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── database.js   # MongoDB connection setup
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   └── feedbackController.js
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   └── errorHandler.js
│   ├── models/           # Database schemas
│   │   ├── User.js
│   │   └── Feedback.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── feedback.js
│   ├── services/         # Business logic
│   │   └── sentimentService.js
│   └── server.js         # Express app setup
└── package.json
```

### Frontend Architecture

```
Frontend/
├── public/
│   └── index.html        # HTML entry point
├── src/
│   ├── components/       # React components
│   │   ├── FeedbackList.js
│   │   ├── SentimentCharts.js
│   │   └── UploadFeedback.js
│   ├── pages/            # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Register.js
│   ├── context/          # React Context
│   │   └── AuthContext.js
│   ├── services/         # API calls
│   │   └── feedbackService.js
│   ├── utils/            # Helper functions
│   │   └── helpers.js
│   ├── styles/           # Component styles
│   │   ├── Auth.css
│   │   ├── Components.css
│   │   └── Dashboard.css
│   ├── App.js            # Main component
│   ├── index.js          # React entry
│   └── index.css         # Global styles
└── package.json
```

## Authentication Flow

```
User → Register/Login → JWT Token → Protected Routes
         ↓
    Database Check
         ↓
    Password Verification (bcrypt)
         ↓
    Token Generation
         ↓
    Stored in localStorage (frontend)
         ↓
    Sent in Authorization header
         ↓
    Verified by auth middleware
```

## Data Flow

### Feedback Upload Flow
```
CSV File → Upload Component → FormData → API
  ↓
CSV Parser → Sentiment Analysis → Database Save
  ↓
Response → Charts Update → UI Render
```

### Real-time Sentiment Analysis
```
Text Input → analyzeSentiment() → Label + Score
  ↓
Classify (Positive/Negative/Neutral)
  ↓
Calculate Confidence
  ↓
Return to Frontend → Display Badge
```

## Key Technologies

### Frontend Dependencies
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **chart.js + react-chartjs-2**: Data visualization
- **react-scripts**: Build tool

### Backend Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT auth
- **multer**: File uploads
- **sentiment**: Sentiment analysis
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Backend
cd Backend
npm install
npm run dev    # With auto-reload

# Frontend (new terminal)
cd Frontend
npm install
npm start
```

### 2. Making Backend Changes

**Adding a new endpoint:**

1. Create controller method in `src/controllers/`
2. Add route in `src/routes/`
3. Test with cURL or Postman
4. Update API_TESTING.md

**Example:**
```javascript
// Controller
exports.myNewEndpoint = async (req, res, next) => {
  try {
    // Logic here
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Route
router.get('/endpoint', protect, myNewEndpoint);
```

### 3. Making Frontend Changes

**Adding a new component:**

1. Create component file in `src/components/`
2. Add styles in `src/styles/`
3. Import and use in pages
4. Test locally

**Component Template:**
```javascript
import React, { useState } from 'react';
import '../styles/MyComponent.css';

const MyComponent = ({ props }) => {
  const [state, setState] = useState(null);

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### 4. Database Changes

**Adding a new field:**

1. Update schema in `models/`
2. Use migrations if needed
3. Update controllers
4. Update frontend forms

**Example:**
```javascript
const feedbackSchema = new Schema({
  // existing fields...
  newField: {
    type: String,
    default: null,
  },
});
```

## API Integration Guide

### Adding New API Endpoint

**Backend:**
```javascript
// routes/feedback.js
router.post('/new-endpoint', protect, feedbackController.newMethod);

// controllers/feedbackController.js
exports.newMethod = async (req, res, next) => {
  try {
    // Implementation
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

**Frontend:**
```javascript
// services/feedbackService.js
newEndpoint: async (params) => {
  const response = await axios.post('/api/feedback/new-endpoint', params);
  return response.data;
};

// Component
const { data } = await feedbackService.newEndpoint({ /* params */ });
```

## Error Handling

### Backend Error Handling
```javascript
try {
  // Operation
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error message'
    });
  }
} catch (error) {
  next(error); // Passed to error handler middleware
}
```

### Frontend Error Handling
```javascript
try {
  const response = await feedbackService.method();
  // Success handling
} catch (error) {
  const errorMsg = error.response?.data?.message || 'Error occurred';
  setError(errorMsg);
}
```

## Testing Guidelines

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong password (fail)
- [ ] Access protected route without token (fail)
- [ ] Token expiration handling

**Feedback Operations:**
- [ ] Upload valid CSV
- [ ] Upload invalid CSV (fail)
- [ ] Add single feedback
- [ ] Delete feedback
- [ ] View all feedback
- [ ] Filter by sentiment

**Sentiment Analysis:**
- [ ] Positive feedback detected
- [ ] Negative feedback detected
- [ ] Neutral feedback detected
- [ ] Sentiment scores calculated correctly

**UI/UX:**
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Charts render correctly
- [ ] Sorting and filtering work
- [ ] Error messages display

### Automated Testing (Future)

```bash
# Backend tests
npm test

# Frontend tests
npm test
```

## Performance Optimization

### Backend Optimization
- Database indexing
- Query optimization with `.lean()` and `.select()`
- Caching frequently accessed data
- Batch processing for large datasets
- Connection pooling

### Frontend Optimization
- Code splitting with React.lazy()
- Memoization with React.memo()
- useCallback for callback optimization
- Image optimization
- Build optimization with webpack

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env`
   - Use strong secrets
   - Rotate secrets regularly

2. **JWT Tokens**
   - Set expiration time
   - Implement refresh tokens (future)
   - Store securely on frontend

3. **Password Security**
   - Hash with bcrypt
   - Minimum 6 characters
   - Implement password strength requirements

4. **CORS**
   - Specify allowed origins
   - Restrict methods
   - Handle preflight requests

5. **Input Validation**
   - Validate on frontend
   - Validate on backend
   - Sanitize user input
   - Type checking with TypeScript (future)

## Deployment Checklist

### Before Production
- [ ] Update `.env` with production values
- [ ] Build frontend: `npm run build`
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Test all endpoints
- [ ] Performance testing

### Production Deployment
```bash
# Build frontend
cd Frontend
npm run build

# Deploy frontend (to CDN or static host)
# Deploy backend (to Heroku, AWS, etc.)

# Start backend
cd Backend
npm start
```

## Monitoring & Logging

### Logging Setup (Future)
```javascript
// Winston or Morgan for logging
const logger = require('winston');

logger.info('User registered: ' + userId);
logger.error('Database error: ' + error);
```

### Error Tracking (Future)
- Sentry for error tracking
- DataDog for monitoring
- CloudWatch for AWS
- New Relic for APM

## Common Development Tasks

### Update Sentiment Analysis
Location: `Backend/src/services/sentimentService.js`

Current implementation uses `sentiment` package. To upgrade:
1. Replace with Google Cloud NLP API
2. Update analysis logic
3. Update response format

### Add Database Field
```javascript
// 1. Update model
schema.add({ newField: String });

// 2. Update controller
req.body.newField // use new field

// 3. Update frontend form
<input name="newField" />
```

### Customize Styling
- Global styles: `Frontend/src/index.css`
- Component styles: `Frontend/src/styles/`
- Use CSS variables for consistency

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push and create PR
git push origin feature/feature-name

# Merge after review
git checkout main
git merge feature/feature-name
```

## Documentation Guidelines

- Update README.md for major changes
- Add JSDoc comments for functions
- Document API changes in API_TESTING.md
- Keep QUICKSTART.md up to date
- Add inline comments for complex logic

---

**Happy coding! 🚀**

For questions or issues, refer to README.md or API_TESTING.md
