require('dotenv').config()

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index')
const trainingRouter = require('./routes/training')
const userRouter = require('./routes/user')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

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

app.listen(process.env.PORT || 3000, () => {
  console.log("Application started and Listening on port 3000");
});



