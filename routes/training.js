const express = require('express');
const auth = require('../auth');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({ username: req.user.username });
    res.render('training/training', { trainings: trainings, isAuthenticated: true });
  });


router.post('/', auth.checkAuthenticated, (req, res) => {   
    const training = new Training({
        name: req.body.name,
        username: req.user.username,
        exercises: req.body.exercises
    });
    training.save((err) => {
        if (err) {
            res.send(JSON.stringify({message: 'There was an error'}))
        };
    });
});

module.exports = router
