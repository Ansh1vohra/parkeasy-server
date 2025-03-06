// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send('User saved successfully');
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { userMail, userName } = req.body;
    let user = await User.findOne({ userMail });

    if (user) {
      return res.status(200).json({ message: 'User already exists', user });
    }

    // 🆕 Create a new user
    user = new User({ userMail, userName });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error("Error in loginWithGoogle:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
