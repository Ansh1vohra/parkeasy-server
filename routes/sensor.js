const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  value: Number,
  sensorNo: Number,
  timestamp: { type: Date, default: Date.now },
});

// Create a model
const SensorData = mongoose.model("SensorData", sensorSchema);

// API Endpoint to Receive IR Sensor Data
router.post("/ir-sensor", async (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: "Missing sensor value" });
    }

    // Save data to MongoDB
    const newData = new SensorData({ value });
    await newData.save();

    res.json({ message: "IR sensor data received", value });
  } catch (error) {
    console.error("Error saving IR sensor data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
