const mongoose = require('mongoose');

const Weight = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    weights: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('weights', Weight)