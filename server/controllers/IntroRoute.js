const express = require('express');
const multer = require('multer');
const User = require('../model/User');
const mongoose = require('mongoose');

const router = express.Router();


// Mongo URI
const mongoURI = process.env.MONGO_URI;

// Create mongo connection
mongoose.connect(mongoURI);


// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload file and user data
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { email, phone, fullName, linkedin } = req.body;
        const resume = req.file.buffer;
        const resumeContentType = req.file.mimetype;

        if (!linkedin && !resume) {
            throw new Error('Please provide either LinkedIn or resume');
        }

        const user = new User({
            email,
            phone,
            fullName,
            linkedin,
            resume,
            resumeContentType
        });

        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            name: user.fullName,
            email: user.email,
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

        res.set('Content-Type', user.resumeContentType);
        res.send(user.resume);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
