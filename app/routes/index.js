const express = require('express');
const router = express.Router()
const Training = require('../models/training');

router.get("/", async (req, res) => {
    if (req.isAuthenticated()) {
        const trainings = await Training.find({'username': req.user.username});
        let distinctExercises = []
        trainings.forEach(el => {
            el.exercises.forEach(exercise => {
                distinctExercises = distinctExercises.concat(exercise.nameLowerCase)
            });
            
        });
        const uniqueExercises = [...new Set(distinctExercises)]
        return res.render('index', { isAuthenticated: req.isAuthenticated(), exercises: uniqueExercises });
        
    }
    return res.render('index', { isAuthenticated: req.isAuthenticated()});
});

  

module.exports = router