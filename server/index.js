const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const introRoute = require('./controllers/introRoute');
const quizRoute = require('./controllers/quizRoute');
const sampleRoute = require('./controllers/sampleRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Server is running');
});


app.use('/intro', introRoute);
app.use('/quiz', quizRoute);
app.use('/sample', sampleRoute);

app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
