'use strict';
const mongoose = require('mongoose');
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true },
    passwordHash: {
        type: String,
        required: true
    }
});

// User model goes here

module.exports = mongoose.model('User', user);