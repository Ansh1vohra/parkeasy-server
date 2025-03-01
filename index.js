require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const routes = require('./routes/index');
app.use('/api', routes);

const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

app.get('/', (req, res) => {
  res.send("Welcome to ParkEasy Server! API is running.");
});

// **Vercel Fix: Remove app.listen()**
module.exports = app; 