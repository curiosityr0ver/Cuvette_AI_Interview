const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI('AIzaSyBFgLsNKuYZaxeSbF9hOtFiX6I-1VbcV3g');
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    // generationConfig: { "response_mime_type": "application/json" }
});
const prompt = "Extract the technologies mentioned in the given parsed text as an array of strings: ";
const answerPrompt = "Rate the answer on a scale of 1-10, don't defend your answer, just rate it:";
const questionOnReact = "What is Virtual DOM in React and how does it help improve the performance of the application?";
const sampleAnswer = "Virtual DOM is a lightweight copy of the actual DOM. It is a JavaScript object that represents the actual DOM elements. React uses the Virtual DOM to improve the performance of the application. When the state of a component changes, React updates the Virtual DOM first, then compares it with the actual DOM. React then updates only the parts of the actual DOM that have changed, which makes the application faster and more efficient.";


async function parseResume(resume) {
    try {
        const result = await model.generateContent([prompt, resume]);
        const rawData = result;
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function askQuestion(question, answer) {
    try {
        const result = await model.generateContent([answerPrompt, question, answer]);
        const rawData = result.response.text();
        return parseInt(rawData);
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


router.post('/question', async (req, res) => {
    const { question, answer } = req.body;
    const rating = await askQuestion(question, answer);
    res.json({ rating });
}
);

module.exports = router;
