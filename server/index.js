const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const userRoute = require('./controllers/userRoute');
const quizRoute = require('./controllers/quizRoute');
const sampleRoute = require('./controllers/sampleRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});


app.use('/intro', userRoute);
app.use('/quiz', quizRoute);
app.use('/sample', sampleRoute);

app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
