require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server (needed for WebSockets)
const server = http.createServer(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Ignore favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Import routes
const routes = require("./routes/allroutes");
app.use("/api", routes);

// Import WebSocket setup
const { initSocket } = require("./routes/sensor");
initSocket(server); // ✅ Initialize WebSocket correctly

// Home Route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ParkEasy Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #0d6efd;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to ParkEasy Server</h1>
        <p>This is the backend server for the ParkEasy application. Use the API endpoints to interact.</p>
      </div>
    </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
