const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const introRoute = require('./controllers/introRoute');
const quizRoute = require('./controllers/quizRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Create the uploads directory if it doesn't exist
const fs = require("fs");
const dir = path.join(__dirname, "uploads");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

app.use('/intro', introRoute);
app.use('/quiz', quizRoute);

app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
