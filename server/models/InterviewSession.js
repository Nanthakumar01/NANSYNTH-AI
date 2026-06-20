const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        category: String, // Technical, Behavioral, Scenario
        suggestedAnswer: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
