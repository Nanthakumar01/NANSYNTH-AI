const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    category: {
    type: String,
    required: true,
    enum: [
        'Arrays',
        'Strings',
        'Linked List',
        'Stack',
        'Trees',
        'Algorithms'
    ]
},
    constraints: [String],
    inputFormat: String,
    outputFormat: String,
    sampleTestCases: [{
        input: String,
        output: String,
        explanation: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);
