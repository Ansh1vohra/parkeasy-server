// server/routes/index.js
const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const sensorRoute = require("./sensor"); 
const bookingRoute = require("./bookingRoutes");

router.use("/users", usersRoute);
router.use("/sensor", sensorRoute); 
router.use("/bookings", bookingRoute);

module.exports = router;
