const express = require('express');
const multer = require('multer');
const User = require('../model/User');
const { generateContent } = require('../utils/gemini_model');
const pdfParse = require('pdf-parse');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Intro Route');
});

module.exports = router;
