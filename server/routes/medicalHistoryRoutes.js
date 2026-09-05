const express = require("express");
const MedicalHistory = require("../models/medicalHistory");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// GET all medical history records
router.get("/",authMiddleware, async (req, res) => {
    try {
        const history = await MedicalHistory.find();

        res.status(200).json(history);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching medical history",
            error: error.message
        });
    }
});

// POST new medical history
router.post("/",authMiddleware, roleMiddleware("doctor"), async (req, res) => {
    try {
        const {
            patientId,
            disease,
            allergies,
            medications,
            previousSurgeries,
            notes
        } = req.body;

        const newHistory = new MedicalHistory({
            patientId,
            disease,
            allergies,
            medications,
            previousSurgeries,
            notes
        });

        const savedHistory = await newHistory.save();

        res.status(201).json(savedHistory);

    } catch (error) {
        res.status(500).json({
            message: "Error creating medical history",
            error: error.message
        });
    }
});
// Get logged-in patient's medical history
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("patient"),
    async (req, res) => {
        try {
            const history = await MedicalHistory.find({
                patientId: req.user.userId
            });

            res.status(200).json(history);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching medical history",
                error: error.message
            });
        }
    }
);
// Doctor can view a patient's medical history
router.get(
    "/patient/:patientId",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const history = await MedicalHistory.find({
                patientId: req.params.patientId
            });

            res.status(200).json(history);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching patient medical history",
                error: error.message
            });
        }
    }
);
module.exports = router;