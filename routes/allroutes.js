// server/routes/index.js
const express = require('express');
const router = express.Router();
const usersRoute = require('./users');
const sensorRoute = require('./sensor');

router.use('/users', usersRoute);
router.use('/sensor', sensorRoute);

module.exports = router;
