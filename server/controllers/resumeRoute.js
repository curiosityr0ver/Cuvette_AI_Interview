const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});

const prompt = "Extract the technologies mentioned in the given parsed text as an array of strings: ";

async function parseResume(resume) {
    try {
        const result = await model.generateContent([prompt, resume]);
        const rawData = result;
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Set up Multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route handler for extracting text from PDF
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);

        const text = data.text;
        const technologies = await parseResume(text);
        res.json({ technologies });
    } catch (error) {
        res.status(500).json({ error: 'Error processing PDF' });
    }
});

module.exports = router;
