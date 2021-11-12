const express = require('express');
const checkAuthenticated = require('../auth');
const router = express.Router()
const Training = require('../models/training');

router.get("/", (req, res) => {
    res.render('index', { isAuthenticated: req.isAuthenticated() });
});

module.exports = router