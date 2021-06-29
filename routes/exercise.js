const express = require('express');
const auth = require('../auth');
const training = require('../models/training');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({'username': req.user.username});
    let exerciseNames = [];
    trainings.forEach(element => {
        element.exercises.forEach(exercise => {
            if (exercise.nameLowerCase){
                // if a training is empty it does not have this prop and pushed undefined instead
                exerciseNames.push(exercise.nameLowerCase);
            };            
        });
    });
    console.log(exerciseNames)
    const uniqueExercises = [...new Set(exerciseNames)].sort();
    console.log(uniqueExercises)
    res.render('exercise/exercises', { exercises: uniqueExercises, isAuthenticated: true });
  });


router.get("/:name", auth.checkAuthenticated, async (req, res) => {
    const reqNameLowerCase = req.params.name.toLowerCase();
    var trainings = await Training.find({ 'exercises.nameLowerCase': reqNameLowerCase, username: req.user.username});    
    if (trainings == null) {
        req.flash('warning', 'Exercise not found');
        return res.redirect('/exercise');        
    };
    trainings.forEach(training => {
        training.exercises = training.exercises.find(el => el.nameLowerCase === reqNameLowerCase)
    });
    console.log(trainings.length)
    res.render('exercise/exercise', {trainings: trainings, isAuthenticated: true});
});

module.exports = router
