const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userMail: String,
    userName: String,
});

module.exports = mongoose.model('User', userSchema);
