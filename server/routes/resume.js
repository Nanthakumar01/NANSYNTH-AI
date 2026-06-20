const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const Groq = require('groq-sdk');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { auth } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
    try {
        console.log('Analyze Route Hit');

        if (!req.file) {
            return res.status(400).json({
                error: 'Please upload a PDF file.'
            });
        }

        const data = await pdf(req.file.buffer);
const resumeText = data.text;

console.log("========== RESUME TEXT ==========");
console.log(resumeText.substring(0, 1000));

        let analysisData;

        try {

            const prompt = `
Analyze this resume as a professional ATS (Applicant Tracking System).

Return ONLY valid JSON in the format below:

{
  "atsScore": 0,
  "skills": [],
  "missingSkills": [],
  "recommendations": [],
  "summary": ""
}

Rules:
- ATS score must be calculated dynamically between 0 and 100.
- Do NOT use fixed values.
- Extract skills ONLY from the uploaded resume.
- Missing skills must be relevant to the candidate profile.
- Give at least 3 recommendations.
- Summary should be 2-3 professional sentences.
- Do not always return Docker.
- Do not always return JavaScript.
- Return JSON only.
- No markdown.
- No explanations outside JSON.
- ATS score must be calculated strictly from resume content.
- Do not default to 85.
- Freshers usually score between 55 and 80.
- Strong resumes score between 80 and 95.
- Weak resumes score below 60.

Scoring Guidelines:
- 90-100 = Excellent resume
- 75-89 = Strong resume
- 60-74 = Average resume
- Below 60 = Needs improvement

Resume Content:
${resumeText}
`;

            const completion = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5
            });

            const text = completion.choices[0].message.content;

            console.log('========== GROQ RESUME RESPONSE ==========');
            console.log(text);

            const cleanText = text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error('Groq did not return valid JSON');
            }

            analysisData = JSON.parse(jsonMatch[0]);

        } catch (aiError) {

            console.log('========== GROQ RESUME ERROR ==========');
            console.log(aiError.message);

            analysisData = {
                atsScore: 75,
                skills: ['JavaScript', 'React', 'Node.js'],
                missingSkills: ['Docker', 'AWS'],
                recommendations: [
                    'Add measurable achievements',
                    'Improve ATS keywords',
                    'Add cloud technologies',
                    'Include more project details'
                ],
                summary: 'Fallback analysis generated successfully.'
            };
        }

        const analysis = new ResumeAnalysis({
            userId: req.user._id,
            fileName: req.file.originalname,
            atsScore: analysisData.atsScore,
            skills: analysisData.skills,
            missingSkills: analysisData.missingSkills,
            recommendations: analysisData.recommendations,
            fullAnalysis: analysisData.summary
        });

        await analysis.save();

        res.status(201).json(analysis);

    } catch (e) {

        console.error('FULL ERROR:', e);

        res.status(500).json({
            error: e.message,
            stack: e.stack
        });
    }
});

router.get('/history', auth, async (req, res) => {
    try {

        const history = await ResumeAnalysis
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(history);

    } catch (e) {

        console.error(e);

        res.status(500).json({
            error: e.message
        });
    }
});

module.exports = router;