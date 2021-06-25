require('dotenv').config();
const User = require('./models/user');

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride= require('method-override');
app.use(methodOverride('_method'))

const passport = require('passport');
const initializePassport = require('./passport-config');
initializePassport(
  passport,
  username => User.findOne({ username: username.trim() }));

const flash = require('express-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const trainingRouter = require('./routes/training');
const userRouter = require('./routes/user');
const exerciseRouter = require('./routes/exercise');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to mongoose.'));


app.use('/', indexRouter)
app.use('/training', trainingRouter)
app.use('/user', userRouter)
app.use('/exercise', exerciseRouter)


app.listen(process.env.PORT || 3000, () => {
  console.log("Application started and Listening on port 3000");
});




