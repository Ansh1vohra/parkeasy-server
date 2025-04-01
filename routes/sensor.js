const express = require("express");
const router = express.Router();
const { Server } = require("socket.io");

// WebSocket setup
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

// API Endpoint to Receive Sensor Data (Without Saving to DB)
router.post("/ultrasonic", async (req, res) => {
  console.log("Received Data:", req.body);

  const { value, sensorNo } = req.body;

  // Emit real-time data to connected clients
  if (io) {
    io.emit("sensorData", { value, sensorNo });
  }

  res.json({ message: "Data received successfully", data: req.body });
});

// ✅ Corrected Export
module.exports = router;  // Export only the router
module.exports.initSocket = initSocket; // Export initSocket separately
