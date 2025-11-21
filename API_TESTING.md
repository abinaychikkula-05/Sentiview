# SentiView - API Testing Guide

## Testing API Endpoints

This guide helps you test the SentiView API endpoints.

### Base URL
```
http://localhost:5000/api
```

## 1. Authentication Endpoints

### Register New User
**POST** `/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "company": "Acme Corp"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

### Login
**POST** `/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

Save the `token` for authenticated requests.

### Get Current User
**GET** `/auth/me`

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

## 2. Feedback Endpoints

All feedback endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Add Single Feedback
**POST** `/feedback`

```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "clientName": "Jane Smith",
    "feedback": "Excellent service and great product quality!",
    "rating": 5,
    "category": "Product Quality"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "clientName": "Jane Smith",
    "feedback": "Excellent service and great product quality!",
    "sentiment": {
      "label": "Positive",
      "score": 0.85,
      "confidence": 0.95
    },
    "rating": 5,
    "category": "Product Quality",
    "createdAt": "2024-11-16T10:30:00.000Z"
  }
}
```

### Upload CSV File
**POST** `/feedback/upload`

```bash
curl -X POST http://localhost:5000/api/feedback/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/feedback.csv"
```

**CSV Format:**
```
clientName,feedback,rating,category
John Smith,"Great service!",5,Customer Service
Jane Doe,"Good product",4,Product Quality
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded 2 feedback items",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "clientName": "John Smith",
      "feedback": "Great service!",
      "sentiment": {
        "label": "Positive",
        "score": 0.8,
        "confidence": 0.9
      },
      "rating": 5,
      "category": "Customer Service",
      "createdAt": "2024-11-16T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "clientName": "Jane Doe",
      "feedback": "Good product",
      "sentiment": {
        "label": "Positive",
        "score": 0.7,
        "confidence": 0.85
      },
      "rating": 4,
      "category": "Product Quality",
      "createdAt": "2024-11-16T10:31:00.000Z"
    }
  ]
}
```

### Get All Feedback
**GET** `/feedback`

```bash
# Get all feedback
curl -X GET http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With filters
curl -X GET "http://localhost:5000/api/feedback?sentiment=Positive&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
- `sentiment` (optional): "Positive", "Negative", or "Neutral"
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "count": 10,
  "stats": {
    "total": 10,
    "positive": 7,
    "negative": 2,
    "neutral": 1,
    "positivePercentage": "70.00",
    "negativePercentage": "20.00",
    "neutralPercentage": "10.00",
    "averageScore": "0.55"
  },
  "data": [...]
}
```

### Get Feedback by ID
**GET** `/feedback/:id`

```bash
curl -X GET http://localhost:5000/api/feedback/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "clientName": "Jane Smith",
    "feedback": "Excellent service and great product quality!",
    "sentiment": {
      "label": "Positive",
      "score": 0.85,
      "confidence": 0.95
    },
    "rating": 5,
    "category": "Product Quality",
    "createdAt": "2024-11-16T10:30:00.000Z"
  }
}
```

### Get Sentiment Analytics
**GET** `/feedback/analytics/summary`

```bash
# Overall analytics
curl -X GET http://localhost:5000/api/feedback/analytics/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With date range
curl -X GET "http://localhost:5000/api/feedback/analytics/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "positive": 7,
    "negative": 2,
    "neutral": 1,
    "positivePercentage": "70.00",
    "negativePercentage": "20.00",
    "neutralPercentage": "10.00",
    "averageScore": "0.55"
  },
  "trend": [
    {
      "_id": {
        "year": 2024,
        "month": 11,
        "day": 16
      },
      "count": 5,
      "avgScore": 0.6,
      "positive": 4,
      "negative": 1,
      "neutral": 0
    }
  ]
}
```

### Delete Feedback
**DELETE** `/feedback/:id`

```bash
curl -X DELETE http://localhost:5000/api/feedback/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

## 3. Health Check

### API Status
**GET** `/health`

```bash
curl -X GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "SentiView API is running",
  "timestamp": "2024-11-16T10:30:00.000Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Feedback not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server Error"
}
```

## Testing with Postman

1. Import these endpoints into Postman
2. Create an environment with variables:
   - `baseUrl`: http://localhost:5000/api
   - `token`: (set after login)

3. Set up Pre-request Script in Login request:
   ```javascript
   // After login, save token
   pm.environment.set("token", pm.response.json().token);
   ```

4. Use `{{token}}` in Authorization headers for other requests

## Testing with cURL

Create a `test-api.sh` script:

```bash
#!/bin/bash

# Register
echo "=== Registering User ==="
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# Add feedback
echo "=== Adding Feedback ==="
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientName": "Test User",
    "feedback": "This is a great product!",
    "rating": 5,
    "category": "Product Quality"
  }' | jq

# Get all feedback
echo "=== Getting All Feedback ==="
curl -X GET http://localhost:5000/api/feedback \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Common Issues

### Token Expired
- Solution: Login again to get a new token

### CORS Error
- Check backend CORS configuration
- Verify `FRONTEND_URL` in `.env`

### CSV Upload Fails
- Verify CSV format matches requirements
- Check file size
- Ensure proper headers in CSV

---

**API Version**: 1.0.0  
**Last Updated**: November 2024
