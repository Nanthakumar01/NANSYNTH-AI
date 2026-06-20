const express = require('express');
const Problem = require('../models/Problem');
const { auth, authorize } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.send(problems);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get problem by ID
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).send({
                error: 'Problem not found'
            });
        }

        res.send(problem);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Run Code (JavaScript & Python)
router.post('/run', async (req, res) => {
    try {

        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({
                error: 'Code is required'
            });
        }

        const tempDir = path.join(__dirname, '../temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        let filePath;
        let command;

        if (language === 'javascript') {

            filePath = path.join(tempDir, 'temp.js');

            fs.writeFileSync(filePath, code);

            command = `node "${filePath}"`;

        } else if (language === 'python') {

            filePath = path.join(tempDir, 'temp.py');

            fs.writeFileSync(filePath, code);

            command = `py "${filePath}"`;

        } else {

            return res.status(400).json({
                error: 'Unsupported language'
            });

        }

        exec(
            command,
            {
                timeout: 5000
            },
            (error, stdout, stderr) => {

                try {

                    if (error) {
                        return res.json({
                            output: stderr || error.message
                        });
                    }

                    res.json({
                        output: stdout || 'Program executed successfully'
                    });

                } finally {

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }

                }
            }
        );

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// Add problem (Admin only)
router.post('/', auth, authorize(['Administrator']), async (req, res) => {
    try {

        const problem = new Problem(req.body);

        await problem.save();

        res.status(201).send(problem);

    } catch (e) {

        res.status(400).send(e);

    }
});
router.post('/submit', async (req, res) => {
    try {

        const { code, language, problemId } = req.body;

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                error: 'Problem not found'
            });
        }

        const expectedOutput =
            problem.sampleTestCases[0].output.trim();

        const tempDir = path.join(__dirname, '../temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        let filePath;
        let command;

        if (language === 'javascript') {

            filePath = path.join(tempDir, 'submit.js');
            fs.writeFileSync(filePath, code);
            command = `node "${filePath}"`;

        } else {

            filePath = path.join(tempDir, 'submit.py');
            fs.writeFileSync(filePath, code);
            command = `py "${filePath}"`;

        }

        exec(command, { timeout: 5000 }, (error, stdout, stderr) => {

            const actualOutput = stdout.trim();

            const passed =
                actualOutput === expectedOutput;

            res.json({
                passed,
                expectedOutput,
                actualOutput,
                error: stderr
            });

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

module.exports = router;