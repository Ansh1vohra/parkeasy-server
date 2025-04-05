const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Route to create a booking
router.post("/create", async (req, res) => {
    try {
        const { userEmail, parkingDuration } = req.body;

        if (parkingDuration <= 0 || parkingDuration > 12) {
            return res.status(400).json({ error: "Invalid parking duration (1-12 hours allowed)" });
        }

        // Check for existing active booking on the same slot
        const activeBooking = await Booking.findOne({
            slotNumber,
            expiryTime: { $gt: new Date() }
        });

        if (activeBooking) {
            return res.status(400).json({ error: "This slot is already booked during the requested time." });
        }

        // Calculate charge
        const totalCharge = parkingDuration === 1 ? 35 : 35 + (parkingDuration - 1) * 25;
        const slotNumber = 1101;

        // Generate QR Code data
        const qrCodeData = `${userEmail}_${Date.now()}_${slotNumber}`;

        // Calculate expiry time based on parking duration
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + parkingDuration);

        // Store booking in DB
        const newBooking = new Booking({
            userEmail,
            bookingTime: new Date(),
            expiryTime,
            parkingDuration,
            qrCodeData,
            totalCharge,
            slotNumber
        });

        await newBooking.save();
        res.json({ success: true, qrCodeData, totalCharge, expiryTime, slotNumber });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Route to get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:userEmail", async (req, res) => {
    try {
        const { userEmail } = req.params;
        const userBookings = await Booking.find({ userEmail });

        if (!userBookings.length) {
            return res.status(404).json({ error: "No bookings found for this user" });
        }

        res.json({ success: true, bookings: userBookings });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
