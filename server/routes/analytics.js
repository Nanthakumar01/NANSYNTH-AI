const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get top students for leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const topStudents = await User.find({})
            .sort({ "stats.averageScore": -1, "stats.codingProblemsSolved": -1 })
            .limit(10)
            .select('name stats role');
        res.send(topStudents);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Update user stats (mock endpoint for testing)
router.post('/update-stats', auth, async (req, res) => {
    try {
        const { totalTestsAttempted, averageScore, codingProblemsSolved } = req.body;
        const user = req.user;
        
        if (totalTestsAttempted !== undefined) user.stats.totalTestsAttempted = totalTestsAttempted;
        if (averageScore !== undefined) user.stats.averageScore = averageScore;
        if (codingProblemsSolved !== undefined) user.stats.codingProblemsSolved = codingProblemsSolved;

        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
