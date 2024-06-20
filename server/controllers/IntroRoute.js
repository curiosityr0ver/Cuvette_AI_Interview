const express = require('express');
const multer = require('multer');
const User = require('../model/User');
const mongoose = require('mongoose');
const { generateContent } = require('../utils/gemini_model');
const pdfParse = require('pdf-parse');

const router = express.Router();

const prompt = "tell me which technologies out of these is the candidate most likely to know: [REACTJS, NODEJS, DBMS, EXPRESS, CLOUD, DEVOPS, ML, DATA ANALYTICS], only return an array";


// Mongo URI
const mongoURI = process.env.MONGO_URI;

// Create mongo connection
mongoose.connect(mongoURI);


// Multer storage configuration
const upload = multer({ storage: multer.memoryStorage() });


// POST route to upload file and user data
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { email, phone, fullName, linkedin } = req.body;
        const dataBuffer = req.file.buffer;
        if (!linkedin && !req.file.buffer) {
            throw new Error('Please provide either LinkedIn or resume');
        }
        let technologies;
        // return console.log(email, phone, fullName, linkedin);

        if (dataBuffer) {
            const data = await pdfParse(dataBuffer);
            const text = data.text;
            const response = await generateContent(prompt, text);
            technologies = response.response.text();
            let start;
            let end;
            for (let i = 0; i < technologies.length; i++) {
                if (technologies[i] == '[') start = i + 1;
                if (technologies[i] == ']') end = i;
            }
            technologies = technologies.substring(start, end);
        }

        const user = new User({
            email,
            phone,
            fullName,
            linkedin,
            technologies,
            resume: dataBuffer,
            resumeContentType: req.file.mimetype
        });

        await user.save();
        res.status(201).json({
            _id: user._id,
            message: 'User created successfully',
            name: user.fullName,
            email: user.email,
            technologies
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

// GET route to fetch user data and resume
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            technologies: user.technologies,
            resume: `http://localhost:3000/resume/${user._id}`
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/resume/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.set('Content-Type', user.resumeContentType);
        res.status(200).send(user.resume);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
