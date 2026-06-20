# PrepForge AI

Smart Placement Preparation Platform built with MERN stack and Gemini AI.

## Features

- **Aptitude Practice**: Categorized quizzes with timers and evaluation.
- **Coding Practice**: Algorithm challenges with a built-in code editor.
- **AI Resume Analyzer**: PDF upload with ATS scoring and skill analysis.
- **AI Interview Generator**: Personalized questions based on career roles.
- **Performance Analytics**: Visual dashboards and competitive leaderboard.
- **Modern UI**: Premium dark mode with glassmorphism and animations.

## Tech Stack

- **Frontend**: React.js, Vite, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB Mongoose.
- **AI**: Google Gemini Pro API.
- **Auth**: JWT, Bcrypt.

## Setup Instructions

1. **Clone the repository**
2. **Backend Setup**:
   - `cd server`
   - `npm install`
   - Create a `.env` file with `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
   - Run `node seed.js` to populate initial data.
   - Run `npm start` or `npx nodemon index.js`.
3. **Frontend Setup**:
   - `cd client`
   - `npm install`
   - Run `npm run dev`.

## License
MIT
