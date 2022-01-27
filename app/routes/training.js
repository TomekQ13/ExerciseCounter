const express = require('express');
const auth = require('../auth');
const router = express.Router()
const Training = require('../models/training')

router.get("/", auth.checkAuthenticated, async (req, res) => {
    const trainings = await Training.find({ username: req.user.username }).sort({'added_dttm': 'desc'});    
    res.render('training/trainings', { trainings: trainings, isAuthenticated: true });
  });

router.get("/:name", auth.checkAuthenticated, async (req, res) => {
    const training = await Training.findOne({ 'username': req.user.username, 'name': req.params.name});
    if (training == null) {
        req.flash('error', 'Taki trening nie istnieje');
        res.redirect('/training');
        return
    };
    res.render('training/training', {training: training, isAuthenticated: true});
});


router.post('/', auth.checkAuthenticated, async (req, res) => {
    const existingTraining = await Training.findOne({ 'name': req.body.name, 'username': req.user.username });
    console.log('received a request to add training' + req.body)
    console.log('request to add')
    console.log(req)
    if (existingTraining) {        
        req.flash('error', 'Trening o takiej nazwie już istnieje');
        return res.status(403).send('Taki trening już istnieje');
    };
    
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
            res.send(JSON.stringify({message: 'Wystąpił problem. Spróbuj ponownie.'}))
        };
    });    
    req.flash('success', 'Trening zapisany');
    res.status(201).send('Trening zapisany pomyślnie');
});

router.delete('/:name', auth.checkAuthenticated, async (req, res) => {
    const training = await Training.findOne({ 'name': req.params.name, 'username': req.user.username });
    if (!training) {
        req.flash('error', 'Trening nie istnieje');
        return res.redirect('/training');
    };

    await training.remove();

    req.flash('success', 'Trening usunięty');
    return res.redirect('/training');
});

// delete exercise from a training
router.delete('/exercise/:trainingName/:exerciseName', auth.checkAuthenticated, async (req, res) => {
    var training = await Training.findOne({ 'name': req.params.trainingName, 'username': req.user.username });
    if (req.user.username != training.username) {
        req.flash('error', 'Niewystarczające uprawnienia');
        return res.redirect('/training');

    };
    var removeIndex = training.exercises.map(item => item.name).indexOf(req.params.exerciseName);
    if (removeIndex == -1) {
        req.flash('error', 'Takie ćwiczenie nie istnieje w treningu o takiej nazwie');
        return res.redirect('/training')
    };

    training.exercises.splice(removeIndex, 1);
    await training.save();

    req.flash('success', 'Trening usunięty');
    return res.redirect('/training/' + encodeURIComponent(training.name));
});

// delete repetition
router.delete('/rep/:trainingName/:exerciseName/:repetitionIndex', auth.checkAuthenticated, async (req, res) => {

    var training = await Training.findOne({ 'name': req.params.trainingName, 'username': req.user.username });
    if (!training) {
        req.flash('error', 'Taki trening nie istnieje');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));

    };

    var exIndex = training.exercises.map(item => item.name).indexOf(req.params.exerciseName);
    if (exIndex == -1) {
        req.flash('error', 'Takie ćwiczenie nie istnieje w treningu o takiej nazwie');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName))
    };

    if (training.exercises[exIndex].count[req.params.repetitionIndex] ==  undefined) {
        req.flash('error', 'To powtórzenie nie istnieje w tym ćwiczeniu');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
    };

    training.exercises[exIndex].count.splice(req.params.repetitionIndex, 1);
    training.markModified('exercises'); // this may probably be improved by making the model more detailed so that less changes have to be made
    await training.save();

    req.flash('success', 'Powtórzenie usunięte');
    return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
});

// add new exercise
router.post('/exercise/:trainingName/', auth.checkAuthenticated, async (req, res) => {
    const existingTraining = await Training.findOne({'name': req.params.trainingName});
    if (!existingTraining) {
        req.flash('error', 'Taki trening nie istnieje');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
    };

    if (req.body.newExName.trim().length === 0) {
        req.flash('error', 'Nazwa ćwiczenia nie może być pusta');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
    }

    const exIndex = existingTraining.exercises.map(item => item.name).indexOf(req.body.newExName)
    if (exIndex != -1) {
        req.flash('error', 'Takie ćwiczenie już istnieje w tym treningu');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
    };

    existingTraining.exercises.push({
        name: req.body.newExName,
        nameLowerCase: req.body.newExName.toLowerCase(),
        count: []
    });
    existingTraining.markModified('exercises'); // this may probably be improved by making the model more detailed so that less changes have to be made
    await existingTraining.save();

    req.flash('success', 'Ćwiczenie dodane');
    return res.redirect('/training/'+ encodeURIComponent(req.params.trainingName));
});

// add new repetition
router.post('/rep/:trainingName/:exerciseName', auth.checkAuthenticated, async (req, res) => {
    if (req.body.rep.trim().length === 0) {
        req.flash('info', 'Wpisz powtórzenie');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName)); 
    };


    var training = await Training.findOne({ 'name': req.params.trainingName, 'username': req.user.username });
    if (!training) {
        req.flash('error', 'Taki trening nie istnieje');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
    };

    var exIndex = training.exercises.map(item => item.name).indexOf(req.params.exerciseName);
    if (exIndex == -1) {
        req.flash('error', 'Takie ćwiczenie nie istnieje w treningu o takiej nazwie');
        return res.redirect('/training/' + encodeURIComponent(req.params.trainingName))
    };

    training.exercises[exIndex].count.push(req.body.rep);
    training.markModified('exercises'); // this may probably be improved by making the model more detailed so that less changes have to be made
    await training.save();

    req.flash('success', 'Powtórzenie dodane');
    return res.redirect('/training/' + encodeURIComponent(req.params.trainingName));
});

module.exports = router
