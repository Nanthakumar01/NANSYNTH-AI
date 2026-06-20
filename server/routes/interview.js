const express = require('express');
const Groq = require('groq-sdk');
const InterviewSession = require('../models/InterviewSession');
const { auth } = require('../middleware/auth');

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Test Route
router.get('/models-test', async (req, res) => {
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: 'hello'
                }
            ]
        });

        res.send(completion.choices[0].message.content);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Generate Interview Questions
router.post('/generate', auth, async (req, res) => {
    try {
        const { role } = req.body;

        console.log('========== INTERVIEW DEBUG ==========');
        console.log('Role:', role);
        console.log('API KEY EXISTS:', !!process.env.GROQ_API_KEY);

        const prompt = `
Generate exactly 10 interview questions for a ${role}.

Requirements:
- 5 Technical Questions
- 2 Scenario Based Questions
- 2 Behavioral Questions
- 1 HR Question

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical",
      "suggestedAnswer": "Answer"
    }
  ]
}
`;

        const completion = await groq.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7
        });

        const text = completion.choices[0].message.content;

        console.log('========== GROQ RESPONSE ==========');
        console.log(text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Groq did not return valid JSON');
        }

        const sessionData = JSON.parse(jsonMatch[0]);

        const session = new InterviewSession({
            userId: req.user._id,
            role,
            questions: sessionData.questions
        });

        await session.save();

        return res.status(201).json({
            ...session.toObject(),
            source: 'groq'
        });

    } catch (error) {

        console.log('========== GROQ ERROR ==========');
        console.log(error);
        console.log('================================');

        const { role } = req.body;

        let backupQuestions = [];

        // PASTE YOUR EXISTING BACKUP QUESTIONS HERE

        if (role?.toLowerCase().includes('frontend')) {
            backupQuestions = [
                {
                    question: 'What is JavaScript?',
                    category: 'Technical',
                    suggestedAnswer: 'JavaScript is a programming language used to build interactive web applications.'
                },
                {
                    question: 'What is React?',
                    category: 'Technical',
                    suggestedAnswer: 'React is a JavaScript library used to build user interfaces.'
                }
            ];
        } else {
            backupQuestions = [
                {
                    question: 'Tell me about yourself.',
                    category: 'HR',
                    suggestedAnswer: 'Provide a brief introduction about your education, skills and projects.'
                },
                {
                    question: 'Why should we hire you?',
                    category: 'HR',
                    suggestedAnswer: 'Explain how your skills and experience match the role.'
                }
            ];
        }

        const session = new InterviewSession({
            userId: req.user._id,
            role,
            questions: backupQuestions
        });

        await session.save();

        return res.status(201).json({
            ...session.toObject(),
            source: 'backup_questions',
            message: 'Groq unavailable. Returned backup questions.'
        });
    }
});

// Interview History
router.get('/history', auth, async (req, res) => {
    try {
        const sessions = await InterviewSession
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(sessions);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;