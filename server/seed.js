const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Problem = require('./models/Problem');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prepforge')
    .then(() => console.log('MongoDB Connected for seeding...'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await Question.deleteMany({});
        await Problem.deleteMany({});

        // Load aptitude questions from JSON file
        const questions = require('./questions.json');

        // Optional coding problems
        const problems = [
            {
                title: "Two Sum",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                difficulty: "Easy",
                category: "Arrays",
                constraints: [
                    "2 <= nums.length <= 10^4",
                    "-10^9 <= nums[i] <= 10^9",
                    "-10^9 <= target <= 10^9"
                ],
                inputFormat: "An array of integers and a target integer.",
                outputFormat: "Indices of the two numbers as an array.",
                sampleTestCases: [
                    {
                        input: "nums = [2,7,11,15], target = 9",
                        output: "[0,1]",
                        explanation: "Because nums[0] + nums[1] == 9."
                    }
                ]
            }
        ];

        await Question.insertMany(questions);
        await Problem.insertMany(problems);

        console.log(`${questions.length} Questions Imported Successfully!`);
        console.log(`${problems.length} Problems Imported Successfully!`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();