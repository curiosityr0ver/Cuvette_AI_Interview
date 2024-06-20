const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Intro Route');
});

module.exports = router;
