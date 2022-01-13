const mongoose = require('mongoose');

const Weight = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    weights: [{added_dttm: Date, value: Number}]
});
 
module.exports = mongoose.model('weights', Weight)