const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
// const introRoute = require('./controllers/introRoute');
// const quizRoute = require('./controllers/quizRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/intro', introRoute);
// app.use('/quiz', quizRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Handle client-side routing
});

app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
