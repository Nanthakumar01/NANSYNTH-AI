const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: String,
    atsScore: Number,
    skills: [String],
    missingSkills: [String],
    recommendations: [String],
    fullAnalysis: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
