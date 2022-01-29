const mongoose = require('mongoose');
const User = require('./user')
const utils = require('../utils')

const Token = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    addedDttm: {
        type: Date,
        required: true,
        default: Date.now
    },
    validToDttm: {
        type: Date,
        required: true,
        default: utils.todayPlusDays(30)
    },
    tokenValue: {
        type: String,
        requried: true,
        default: utils.randomString(64)
    },
});

module.exports = mongoose.model('rememberMeTokens', Token)