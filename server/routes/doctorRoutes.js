const express = require("express");
const Doctor = require("../models/doctor");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

// GET all doctors
router.get("/",authMiddleware, roleMiddleware("admin", "doctor","patient"), async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching doctors",
            error: error.message
        });
    }
});

// POST create doctor
router.post("/",authMiddleware,
    roleMiddleware("admin"), async (req, res) => {
    try {
        const {
            doctorId,
            name,
            specialization,
            phone,
            email,
            available
        } = req.body;

        const newDoctor = new Doctor({
            doctorId,
            name,
            specialization,
            phone,
            email,
            available
        });

        const savedDoctor = await newDoctor.save();

        res.status(201).json(savedDoctor);

    } catch (error) {
        res.status(500).json({
            message: "Error creating doctor",
            error: error.message
        });
    }
});

module.exports = router;