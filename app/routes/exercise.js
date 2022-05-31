const express = require('express');
const auth = require('../auth');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({'username': req.user.username});
    let exerciseNames = [];
    trainings.forEach(element => {
        element.exercises.forEach(exercise => {
            if (exercise.nameLowerCase) {
                // if a training is empty it does not have this prop and pushed undefined instead
                exerciseNames.push(exercise.nameLowerCase);
            };            
        });
    });
    const uniqueExercises = [...new Set(exerciseNames)].sort();
    res.render('exercise/exercises', { exercises: uniqueExercises, isAuthenticated: true });
  });


router.get("/:name", auth.checkAuthenticated, async (req, res) => {
    const limit = req.query.limit;


    const reqNameLowerCase = req.params.name.toLowerCase();

    let trainings
    if (limit !== undefined && isNaN(+limit) === false) {
        trainings = await Training.find({ 'exercises.nameLowerCase': reqNameLowerCase, username: req.user.username}).sort({'added_dttm': 'desc'}).limit(+limit);
    } else {
        trainings = await Training.find({ 'exercises.nameLowerCase': reqNameLowerCase, username: req.user.username}).sort({'added_dttm': 'desc'});
    }
        
    if (trainings === null) {
        req.flash('warning', 'Exercise not found');
        return res.redirect('/exercise');        
    };
    trainings.forEach(training => {
        training.exercises = training.exercises.find(el => el.nameLowerCase === reqNameLowerCase)
    });


    if (req.query.json === 'true') {
        const trainingToSend = trainings[0];
        ({ exercises, name, added_dttm } = trainingToSend)
        return res.json({ exercises, name, added_dttm });
    }
    res.render('exercise/exercise', {trainings: trainings, exName: reqNameLowerCase, isAuthenticated: true});
});

module.exports = router
