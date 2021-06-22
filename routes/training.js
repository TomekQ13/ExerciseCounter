const express = require('express');
const auth = require('../auth');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({ username: req.user.username });
    res.render('training/trainings', { trainings: trainings, isAuthenticated: true });
  });

router.get("/:name", auth.checkAuthenticated, async (req, res) => {
    const training = await Training.findOne({ 'username': req.user.username, 'name': req.params.name});
    if (training == null) {
        req.flash('warning', 'Training not found');
        res.redirect('/training');
        return
    };
    res.render('training/training', {training: training, isAuthenticated: true});
});


router.post('/', auth.checkAuthenticated, (req, res) => {  
    let training = new Training({
        name: req.body.name,
        username: req.user.username,
        exercises: req.body.exercises
    });
    // add lowercase property for easier querying
    training.exercises.forEach(el => {
        el.nameLowerCase = el.name.toLowerCase()
    });
    training.save((err) => {
        if (err) {
            res.send(JSON.stringify({message: 'There was an error'}))
        };
    });
});

module.exports = router
