const express = require('express')
const router = express.Router()
const Weight = require('../models/weight.js')
const auth = require('../auth')
const { v4: uuidv4 } = require('uuid');

router.get('/', auth.checkAuthenticated, (req, res) => {
    const weights = Weight.findOne({'username': req.user.username})
    return res.render('weight/weight', {weights: weights})
})

router.post('/', auth.checkAuthenticated, (req, res) => {
    const weight = newWeight({
        valueId: uuidv4(),
        date: req.body.date,
        value: req.body.weight,
        username: req.user.username,
        description: req.body.description
    })
    try {
        await weight.save()
        return res.status(201).send('Weight added successfully to the database')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while saving the weight to the database'
        console.log(errorMessage)
        return res.status(500).send(errorMessage)
    }
})

router.delete('/:valueId', auth.checkAuthenticated, (req, res) => {
    const weightToDelete = Weight.findOne({'id': req.params.valueId})
    if (!weightToDelete) {
        return res.status(404).send('Weigt value does not exist')
    }
    if (weightToDelete.username != req.user.username) {
        return res.status(403).send('Incorrect username')
    }
    try {
        await weightToDelete.delete()
        return res.status(200).send('Weight value deleted successfully')
    } catch (err) {
        console.error(err)
        const errorMessage = 'There has been an error while deleting the weight value'
        console.log(errorMessage)
        return res.status(500).send(errorMessage)
    }    
})