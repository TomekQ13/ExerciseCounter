const express = require('express')
const router = express.Router()
const Training = require('../models/training')

// router.get("/", (req, res) => {
//     res.render('index');
//   });

// router.get("/new", (req, res) => {
//     res.render('training/new')
// })

// create training route
router.post('/',  (req, res) => {
    console.log(req.body)
    const training = new Training({
        name: req.body.name,
        username: req.body.username,
        exercises: req.body.exercises
    })
    training.save((err) => {
        if (err) {
            res.send(JSON.stringify({message: 'There was an error'}))
        }
    })
})

module.exports = router
