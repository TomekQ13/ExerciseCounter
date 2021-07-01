const express = require('express');
const checkAuthenticated = require('../auth');
const router = express.Router()
const Training = require('../models/training');

router.get("/", (req, res) => {
    res.render('index', { isAuthenticated: req.isAuthenticated() });
});

// router.get("/db/migrate", async (req, res) => {
//     var trainings = Training.find();
//     trainings.forEach((el) => {
//         el.exercises.forEach((elem) => {
//             elem.nameLowerCase = elem.name.toLowerCase()
//         })
//         el.markModified('exercises');
//     })
//     console.log('asdasd')
//     await trainings.save()
//     res.status(200).send('Create lower case names successfully')
// });

    

module.exports = router