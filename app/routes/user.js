const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport');
const auth = require('../auth');
const flash = require('express-flash');

router.get("/login", auth.checkNotAuthenticated, (req, res) => {
    res.render('user/login', { isAuthenticated: false });
  });
 
router.post("/login", auth.checkNotAuthenticated, passport.authenticate('local', {
        failureRedirect: '/user/login',
        failureFlash: true
}), (req, res) => {
    if (req.session.redirectTo) {
        // here needs to be a check if it's post and if yes it needs to be repeated with fetch
        return res.redirect(req.session.redirectTo)
    }
    return res.redirect('/')
    
}

);

router.get('/logout', auth.checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('/user/login');
});


router.get("/register", auth.checkNotAuthenticated, (req, res) => {
    res.render('user/register', { isAuthenticated: false });
  });

router.post("/register", auth.checkNotAuthenticated, async (req, res) => {

        const emailExists =  await User.findOne({ 'email': req.body.email.trim().toLowerCase() });
        if (emailExists != null) {
            req.flash('error', 'Ten email jest już przypisany do użytkownika');
            return res.redirect('/user/register');
        };

        const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (! mailFormat.test(req.body.email.trim().toLowerCase())) {
            req.flash('error', 'Podany email jest niepoprawny')
            return res.redirect('/user/register')
        };
        const usernameExists  = await User.findOne({ 'username': req.body.username.trim() })
        if (usernameExists != null) {
            req.flash('error', 'Taki użytkownik już istnieje');
            return res.redirect('/user/register');
        }; 

        if (req.body.password.trim().length === 0) {
            req.flash('error', 'Hasło nie może zawierać spacji');
            return res.redirect('/user/register');
        };
         
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username.trim(),
            email: req.body.email.trim().toLowerCase(),
            password: hashedPassword
        });
    try {  
        await user.save();
        return res.redirect('/user/login');
    } catch {
        req.flash('error', 'Wystąpił błąd. Spróbuj ponownie.')
        return res.redirect('/user/register');
    };
  });

module.exports = router