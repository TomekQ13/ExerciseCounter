const express = require('express')
const router = express.Router()
const Weight = require('../models/weight')
const auth = require('../auth')
const { v4: uuidv4 } = require('uuid');

router.get('/', auth.checkAuthenticated, (req, res) => {
    try {
        const weights = await Weight.find({username: req.user.username}).sort({'added_dttm': 'desc'})
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
        return res.status(201).redirect('/weight')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while saving the weight to the database'
        console.log(errorMessage)
        return res.status(500).send(errorMessage)
    }
})

router.delete('/:valueId', auth.checkAuthenticated, (req, res) => {
    const weightToDelete = Weight.findOne({'_id': req.params.valueId})
    if (!weightToDelete) {
        return res.status(404).send('Weigt value does not exist')
    }
    if (weightToDelete.username != req.user.username) {
        return res.status(403).send('Incorrect username')
    }
    try {
        weightToDelete.delete()
        return res.status(200).send('Weight value deleted successfully')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while deleting the weight value'
        console.log(errorMessage)
        return res.status(500).send(errorMessage)
    }    
})

module.exports = router