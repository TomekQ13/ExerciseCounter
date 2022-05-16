const express = require('express');
const auth = require('../auth');
const router = express.Router()
const User = require('../models/user')


router.get("/", auth.checkAuthenticated, async (req, res) => {
    res.render('account/account', { username: req.user.username });
})

module.exports = router