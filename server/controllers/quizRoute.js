const express = require('express');
const { generateContent } = require('../utils/gemini_model');

const router = express.Router();
const answerPrompt = "Rate the answers on a scale of 1-10, and give the response as an array of ratings";

async function askQuestion(question, answer) {
    const response = await generateContent(answerPrompt, question, answer);
    const finRes = response.response.text().split(' ')[0];
    return parseInt(finRes);
}

async function askQuestions(questions, answers) {
    const ratings = await generateContent(answerPrompt, JSON.stringify({ questions, answers }));
    return ratings.response.text();
}

router.post('/', async (req, res) => {
    const { questions, answers } = req.body;
    const rating = await askQuestion(questions, answers);
    res.json({ rating });
});

router.post('/batch', async (req, res) => {
    const { questions, answers } = req.body;
    const ratings = await askQuestions(questions, answers);
    res.json(ratings);
});

module.exports = router;
