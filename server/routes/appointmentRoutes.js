const express = require("express");
const Appointment = require("../models/appointment");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const DoctorAvailability = require("../models/doctorAvailability");

const router = express.Router();

// GET all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });
  }
});


// POST new appointment
router.post("/", authMiddleware,
    roleMiddleware("patient"), async (req, res) => {
  try {
    const {
    appointmentId,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason
} = req.body;

const patientId = req.user.userId;
console.log("LOGGED IN USER:", req.user);
console.log("PATIENT ID:", patientId);
    // Check if doctor is available on the selected day
    const selectedDate = new Date(appointmentDate);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const selectedDay = days[selectedDate.getDay()];

    const availability = await DoctorAvailability.findOne({
      doctorId: doctorId,
      day: selectedDay,
      isAvailable: true
    });

    // If doctor is not available
    if (!availability) {
      return res.status(400).json({
        message: `Doctor is not available on ${selectedDay}`
      });
    }

    // Check appointment time
    if (
      appointmentTime < availability.startTime ||
      appointmentTime >= availability.endTime
    ) {
      return res.status(400).json({
        message: `Doctor is available only from ${availability.startTime} to ${availability.endTime}`
      });
    }

    // Create appointment
    const appointment = new Appointment({
      appointmentId,
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason
    });

    const savedAppointment = await appointment.save();

    res.status(201).json(savedAppointment);

  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message
    });
  }
});
// Get logged-in patient's appointments
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("patient"),
    async (req, res) => {
        try {
            const appointments = await Appointment.find({
                patientId: req.user.userId
            });

            res.status(200).json(appointments);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching patient appointments",
                error: error.message
            });
        }
    }
);
// Get logged-in doctor's appointments
router.get(
    "/doctor",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const appointments = await Appointment.find({
                doctorId: req.user.userId
            });

            res.status(200).json(appointments);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching doctor's appointments",
                error: error.message
            });
        }
    }
);
module.exports = router;