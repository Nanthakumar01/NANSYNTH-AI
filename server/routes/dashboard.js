const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Problem = require('../models/Problem');


const router = express.Router();


router.get('/stats', async (req, res) => {
    try {
        const totalQuestions = await Question.countDocuments();
        const totalProblems = await Problem.countDocuments();
        const totalUsers = await User.countDocuments();

        res.json({
            totalQuestions,
            totalProblems,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;