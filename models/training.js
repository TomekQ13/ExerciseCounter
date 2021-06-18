const mongoose = require('mongoose');

const Training = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    added_dttm: {
        type: Date,
        required: true,
        default: Date.now
    },
    exercises: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Training', Training)