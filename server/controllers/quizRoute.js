const express = require('express');
const { generateContent } = require('../utils/gemini_model');

const router = express.Router();
const answerPrompt = "Assume I am the CTO of a Indian software company interviewing candidates for an SDE job, Rate the answers on a scale of 1-10, and give the response as an array of ratings";
const newAnswerPrompt =
    "\nRate and review each of the answers on a scale of [1-10]\n\nUsing this JSON schema:\n\n  Ratings = {\"rating\": number, \n\"remark\": string }\n\nReturn a `list[Rating]`\n      ";

async function askQuestion(question, answer) {
    const response = await generateContent(answerPrompt, question, answer);
    const finRes = response.response.text().split(' ');
    return parseInt(finRes);
}

async function askQuestions(questions, answers) {
    const ratings = await generateContent(answerPrompt, JSON.stringify({ questions, answers }));
    return ratings;
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
