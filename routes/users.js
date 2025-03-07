const express = require('express');
const router = express.Router();
const User = require('../models/user');
const sendEmail = require('../functions/sendEmail');

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


//OTP APIs

const otpStorage = {};

//Send OTP API
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  otpStorage[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
  };

  try {
    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP API
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const storedOtpData = otpStorage[email];

  if (!storedOtpData) {
    return res.status(400).json({ error: "OTP not found. Please request a new one." });
  }

  if (Date.now() > storedOtpData.expiresAt) {
    delete otpStorage[email]; // Remove expired OTP
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  if (storedOtpData.otp == otp) {
    delete otpStorage[email]; // Remove OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ error: "Invalid OTP. Please try again." });
  }
});

module.exports = router;
