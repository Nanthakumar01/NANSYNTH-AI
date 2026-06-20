const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Problem = require('./models/Problem');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const aptitudeRoutes = require('./routes/aptitude');
const codingRoutes = require('./routes/coding');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('PrepForge AI Backend is running...');
});
app.get('/seed', async (req, res) => {
  try {


    await Question.deleteMany({});
    await Problem.deleteMany({});

    await Question.insertMany(questions);
    await Problem.insertMany(problems);

    res.send('Database Seeded Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prepforge')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
