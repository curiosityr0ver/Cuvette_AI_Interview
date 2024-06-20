const express = require('express');
const { generateContent } = require('../utils/gemini_model');

const router = express.Router();
const answerPrompt = "Rate the answer on a scale of 1-10, don't defend your answer, just rate it:";


router.get('/', (req, res) => {
    res.send('Intro Route');
});

module.exports = router;
