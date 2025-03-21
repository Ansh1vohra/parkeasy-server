const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  value: Number,
  sensorNo: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sensor', sensorSchema);