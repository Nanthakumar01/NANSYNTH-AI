const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);