const express = require('express');
const auth = require('../auth');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({'username': req.user.username});
    let exerciseNames = [];
    trainings.forEach(element => {
        element.exercises.forEach(exercise => {
            exerciseNames.push(exercise.nameLowerCase);
        });
    });
    const uniqueExercises = [...new Set(exerciseNames)].sort();
    res.render('exercise/exercises', { exercises: uniqueExercises, isAuthenticated: true });
  });

router.get("/:name", auth.checkAuthenticated, async (req, res) => {
    var trainings = await Training.find({ 'exercises.nameLowerCase': req.params.name.toLowerCase()});
    if (trainings == null) {
        req.flash('warning', 'Exercise not found');
        res.redirect('/exercise');
        return
    };
    trainings.forEach(training => {
        training.exercises.forEach(element => {
            element.nameLowerCase === req.params.name.toLowerCase()
        });
    }); //here still the array needs to be filtered to contain only request exercise
    console.log(trainings);
    res.render('exercise/exercise', {trainings: trainings, isAuthenticated: true});
});

module.exports = router
