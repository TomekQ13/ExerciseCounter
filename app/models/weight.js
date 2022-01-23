const mongoose = require('mongoose');

const Weight = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    weightValue: {
        type: Number,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});
 
module.exports = mongoose.model('weights', Weight)