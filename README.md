# SentiView: Client Feedback Analysis and Sentiment Dashboard

A full-stack web application for analyzing client feedback with AI-powered sentiment analysis and interactive dashboards.

## Project Overview

SentiView enables businesses to:
- Upload and manage client feedback data (CSV format)
- Automatically classify feedback sentiment (Positive, Negative, Neutral)
- Visualize sentiment trends and distributions
- Track feedback analytics over time
- Manage user accounts with secure authentication

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Sentiment.js** - Sentiment analysis
- **JWT** - Authentication
- **Multer** - File upload handling

## Project Structure

```
Sentiview/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   └── feedbackController.js # Feedback operations
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   └── Feedback.js           # Feedback schema
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth routes
│   │   │   └── feedback.js           # Feedback routes
│   │   ├── services/
│   │   │   └── sentimentService.js   # Sentiment analysis logic
│   │   ├── utils/                    # Utility functions
│   │   └── server.js                 # Main server file
│   ├── uploads/                      # Uploaded files directory
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Dependencies
│   └── sample-feedback.csv           # Sample data for testing
│
└── Frontend/
    ├── public/
    │   └── index.html                # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── FeedbackList.js       # Feedback display component
    │   │   ├── SentimentCharts.js    # Charts component
    │   │   └── UploadFeedback.js     # Upload/form component
    │   ├── context/
    │   │   └── AuthContext.js        # Auth state management
    │   ├── pages/
    │   │   ├── Dashboard.js          # Main dashboard
    │   │   ├── Login.js              # Login page
    │   │   └── Register.js           # Registration page
    │   ├── services/
    │   │   └── feedbackService.js    # API calls
    │   ├── styles/
    │   │   ├── Auth.css              # Auth pages styling
    │   │   ├── Components.css        # Component styling
    │   │   └── Dashboard.css         # Dashboard styling
    │   ├── utils/
    │   │   └── helpers.js            # Utility functions
    │   ├── App.js                    # Main app component
    │   ├── App.css                   # App styles
    │   ├── index.js                  # React entry point
    │   └── index.css                 # Global styles
    └── package.json                  # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and other configurations:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentiview
   PORT=5000
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

App runs on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "company": "Acme Corp"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt_token

Response: { success: true, user: {...} }
```

### Feedback Endpoints

#### Upload CSV Feedback
```
POST /api/feedback/upload
Authorization: Bearer jwt_token
Content-Type: multipart/form-data

Form Data:
- file: <csv_file>

Response: { success: true, message: "...", data: [...] }
```

#### Add Single Feedback
```
POST /api/feedback
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "clientName": "Jane Smith",
  "feedback": "Great product and excellent service!",
  "rating": 5,
  "category": "Product Quality"
}

Response: { success: true, data: {...} }
```

#### Get All Feedback
```
GET /api/feedback?sentiment=Positive&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer jwt_token

Response: { success: true, count: 10, stats: {...}, data: [...] }
```

#### Get Sentiment Analytics
```
GET /api/feedback/analytics/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer jwt_token

Response: {
  success: true,
  stats: {
    total: 10,
    positive: 7,
    negative: 2,
    neutral: 1,
    positivePercentage: "70.00",
    negativePercentage: "20.00",
    neutralPercentage: "10.00",
    averageScore: "0.55"
  },
  trend: [...]
}
```

#### Delete Feedback
```
DELETE /api/feedback/:id
Authorization: Bearer jwt_token

Response: { success: true, message: "Feedback deleted successfully" }
```

## Sample Data

Use the included `sample-feedback.csv` file for testing:

```csv
clientName,feedback,rating,category
John Smith,"Excellent service! The team was very responsive.",5,Customer Service
Sarah Johnson,"The product quality is outstanding.",5,Product Quality
Mike Davis,"Had some issues but support fixed it quickly.",4,Logistics
Emma Wilson,"Poor communication and delayed responses.",2,Customer Service
```

## Features

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Session management

### Feedback Management
- Upload feedback via CSV
- Add feedback manually through UI
- Real-time sentiment analysis
- Edit feedback metadata
- Delete feedback

### Sentiment Analysis
- Automatic classification (Positive/Negative/Neutral)
- Sentiment scoring (-1 to +1)
- Confidence metrics
- Batch processing

### Analytics & Visualization
- Sentiment distribution pie chart
- Sentiment trend line chart
- Breakdown bar chart
- Summary statistics cards
- Real-time metrics

### User Interface
- Responsive design (Desktop/Tablet/Mobile)
- Intuitive dashboard
- Filter by sentiment
- Search and sort capabilities
- Error handling and notifications

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  company: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  clientName: String,
  feedback: String (required),
  sentiment: {
    label: String (enum: [Positive, Negative, Neutral]),
    score: Number (-1 to 1),
    confidence: Number (0 to 1)
  },
  rating: Number (1 to 5),
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Sentiment Analysis Details

The sentiment analysis uses the `sentiment` npm package:

- **Positive**: Score > 0
- **Negative**: Score < 0
- **Neutral**: Score = 0

Scores are normalized from -1 to +1 for consistency.

## Security Considerations

- Use strong JWT secrets in production
- Enable HTTPS
- Implement rate limiting
- Sanitize CSV uploads
- Use environment variables for sensitive data
- Implement CORS properly
- Add input validation
- Use CSRF tokens if applicable

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific errors

### Upload Failures
- Verify CSV format matches template
- Check file size limits in Multer config
- Ensure `/uploads` directory exists and is writable

## Performance Optimization

- Implement pagination for large datasets
- Use database indexes
- Cache frequently accessed data
- Optimize chart rendering
- Lazy load components
- Minify production builds

## License

MIT License - Feel free to use for personal and commercial projects.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console for error messages
4. Verify environment configuration

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Project**: SentiView Development