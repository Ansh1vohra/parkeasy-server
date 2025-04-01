const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    bookingTime: { type: Date, default: Date.now },
    expiryTime: { type: Date, required: true }, // 30 min validity
    parkingDuration: { type: Number, required: true }, // in hours
    qrCodeData: { type: String, required: true },
    totalCharge: { type: Number, required: true },
    slotNumber: { type: Number, required: true } // Added slotNumber
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
