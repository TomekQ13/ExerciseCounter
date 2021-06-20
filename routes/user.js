const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport');
const auth = require('../auth');

router.get("/login", auth.checkNotAuthenticated, (req, res) => {
    res.render('user/login', { isAuthenticated: false });
  });
 
router.post("/login", auth.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.post('/logout', auth.checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('/user/login');
});


router.get("/register", auth.checkNotAuthenticated, (req, res) => {
    res.render('user/register', { isAuthenticated: false });
  });

router.post("/register", auth.checkNotAuthenticated, async (req, res) => {
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