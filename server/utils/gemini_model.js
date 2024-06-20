const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: {
        "responseMimeType": "application/json"
    }
});


const generateContent = async (...args) => {

    try {
        const result = await model.generateContent(args);
        const response = result.response.text();
        return JSON.parse(response);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { generateContent };