const express = require('express')
const router = express.Router()
const Weight = require('../models/weight')
const auth = require('../auth')
const { v4: uuidv4 } = require('uuid');

router.get('/', auth.checkAuthenticated, async (req, res) => {
    try {
        const weights = await Weight.find({username: req.user.username}).sort({'added_dttm': 'desc'});
        return res.render('weight/weight', {weights: weights, isAuthenticated: true})
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while retrieving data from the database'
        console.error(errorMessage)
        return res.status(500).redirect('/')
    }   
})

router.post('/', auth.checkAuthenticated, (req, res) => {
    try {
        const weight = new Weight({
            _id: uuidv4(),
            date: req.body.date,
            weightValue: req.body.weightValue,
            username: req.user.username,
            description: req.body.description
        })
        weight.save()
        req.flash('Waga dodana pomyślnie')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while saving the weight to the database'
        console.log(errorMessage)
        req.flash('error', errorMessage + '. Please try again.')
    }
    return res.status(201).redirect('/weight')
})

router.delete('/:valueId', auth.checkAuthenticated, async (req, res) => {
    const weightToDelete = await Weight.findOne({'_id': req.params.valueId})
    if (weightToDelete === undefined) {
        req.flash('error', 'Weigt value does not exist')
        return res.redirect('/weight')
    }
    if (weightToDelete.username != req.user.username) {
        req.flash('error', 'Incorrect username')
        return res.redirect('/weight')
    }
    try {
        weightToDelete.delete()
        req.flash('success', 'Waga dodana pomyślnie')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while deleting the weight value'
        console.log(errorMessage)
        req.flash('error', errorMessage + '. Please try again.')
    }
    return res.redirect('/weight')
})

module.exports = router