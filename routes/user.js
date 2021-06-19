const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get("/login", (req, res) => {
    res.render('user/login');
  });

router.get("/login", (req, res) => {
    res.render('user/login');
  });


router.get("/register", (req, res) => {
    res.render('user/register');
  });

router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/user/login');
    } catch {
        res.redirect('/user/register')
    };
  });

module.exports = router