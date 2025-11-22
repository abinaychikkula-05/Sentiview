# Copilot Instructions for SentiView

## Project Architecture
- **Monorepo** with `Backend` (Node.js/Express/MongoDB) and `Frontend` (React.js/Chart.js).
- **Backend**: REST API for authentication, feedback management, sentiment analysis. Key files: `src/server.js`, `controllers/`, `models/`, `services/sentimentService.js`.
- **Frontend**: React SPA with dashboard, feedback upload, analytics. Key files: `src/components/`, `src/pages/`, `src/services/feedbackService.js`.

## Developer Workflows
- **Backend**:
  - Install: `cd Backend && npm install`
  - Start: `npm start` (prod) or `npm run dev` (dev, auto-reload)
  - Env setup: Copy `.env.example` to `.env` and configure MongoDB URI, JWT secret, etc.
- **Frontend**:
  - Install: `cd Frontend && npm install`
  - Start: `npm start` (dev server)

## Data Flow & Integration
- **Feedback**: Uploaded via CSV or manual entry (Frontend), sent to `/api/feedback` endpoints (Backend), stored in MongoDB, analyzed for sentiment.
- **Sentiment Analysis**: Uses `sentiment` npm package, results stored in `Feedback` model (`sentiment.label`, `score`, `confidence`).
- **Authentication**: JWT-based, managed via `authController.js` and `AuthContext.js`.
- **File Uploads**: Handled by Multer, stored in `Backend/uploads/`.

## Project-Specific Patterns
- **API calls**: Use `feedbackService.js` (Frontend) for all feedback-related requests.
- **State Management**: Auth state via `AuthContext.js`.
- **Styling**: CSS modules in `src/styles/`.
- **Error Handling**: Centralized in `middleware/errorHandler.js` (Backend), UI notifications (Frontend).
- **Environment Variables**: Always use `.env` for secrets and config.

## External Dependencies
- **Backend**: Express, Mongoose, Sentiment.js, Multer, JWT, bcrypt.
- **Frontend**: React, Chart.js, Axios.
- **Database**: MongoDB (local or Atlas).

## Conventions & Tips
- **Feedback CSV**: Must match `sample-feedback.csv` format.
- **API endpoints**: See README for full docs and sample requests.
- **Testing**: Use sample data for manual API/UI testing.
- **Troubleshooting**: See README for common issues (MongoDB, CORS, uploads).
- **Security**: Use strong secrets, sanitize uploads, validate input.

## Key Files & Directories
- `Backend/src/server.js`: Main server entry
- `Backend/src/controllers/`: API logic
- `Backend/src/models/`: Mongoose schemas
- `Backend/src/services/sentimentService.js`: Sentiment analysis
- `Frontend/src/components/`: UI components
- `Frontend/src/pages/`: Main pages
- `Frontend/src/services/feedbackService.js`: API integration
- `Frontend/src/context/AuthContext.js`: Auth state
- `sample-feedback.csv`: Data template

---
For more details, see `README.md` and API docs. If unclear, ask for clarification or check referenced files.
