const express = require('express');
const Question = require('../models/Question');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get categories and question counts
router.get('/categories', async (req, res) => {
    try {
        const categories = await Question.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.send(categories);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get questions by category
router.get('/quiz/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category }).limit(10);
        res.send(questions);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Add question (Admin only)
router.post('/', auth, authorize(['Administrator']), async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).send(question);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
