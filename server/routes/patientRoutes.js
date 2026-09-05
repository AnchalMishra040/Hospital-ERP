const express = require("express");
const Patient = require("../models/patient");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
console.log("PATIENT ROUTES FILE LOADED");
router.get("/test-me", (req, res) => {
    res.send("ME ROUTE IS WORKING!");
});
// Test route
router.get("/", authMiddleware,
    roleMiddleware("admin", "doctor"),async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching patients",
            error: error.message
        });
    }
});

// Create patient profile
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            name,
            dateOfBirth,
            gender,
            phone,
            address,
            bloodGroup,
            emergencyContact
        } = req.body;

        const patient = new Patient({
            userId,
            name,
            dateOfBirth,
            gender,
            phone,
            address,
            bloodGroup,
            emergencyContact
        });

        const savedPatient = await patient.save();

        res.status(201).json(savedPatient);

    } catch (error) {
        res.status(500).json({
            message: "Error creating patient",
            error: error.message
        });
    }
});
// your existing route
// ...

// Get logged-in patient's own profile
router.get("/me", authMiddleware, roleMiddleware("patient"), async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        res.status(200).json(patient);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching patient profile",
            error: error.message
        });
    }
});
// Doctor can view a patient's profile
router.get(
    "/:patientId",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const patient = await Patient.findOne({
                userId: req.params.patientId
            });

            if (!patient) {
                return res.status(404).json({
                    message: "Patient not found"
                });
            }

            res.status(200).json(patient);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching patient",
                error: error.message
            });
        }
    }
);

// Doctor can view patients who have appointments with them
router.get(
    "/doctor/my-patients",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const Appointment = require("../models/appointment");

            const appointments = await Appointment.find({
                doctorId: req.user.userId
            });

            const patientIds = [
                ...new Set(appointments.map(appointment => appointment.patientId))
            ];

            const patients = await Patient.find({
                userId: { $in: patientIds }
            });

            res.status(200).json(patients);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching doctor's patients",
                error: error.message
            });
        }
    }
);
module.exports = router;