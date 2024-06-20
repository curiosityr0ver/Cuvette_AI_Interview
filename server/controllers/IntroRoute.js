const express = require('express');
const { generateContent } = require('../utils/gemini_model');

const router = express.Router();
const answerPrompt = "Rate the answer on a scale of 1-10, don't defend your answer, just rate it:";

async function askQuestion(question, answer) {
    const response = await generateContent(answerPrompt, question, answer);
    const finRes = response.response.text().split(' ')[0];
    return parseInt(finRes);
}

async function askQuestions(questions, answers) {
    const ratings = [];
    for (let i = 0; i < questions.length; i++) {
        const rating = await askQuestion(questions[i], answers[i]);
        ratings.push(rating);
    }
    return Promise.all(ratings);
}

router.post('/', async (req, res) => {
    const { question, answer } = req.body;
    const rating = await askQuestion(question, answer);
    res.json({ rating });
});

module.exports = router;
