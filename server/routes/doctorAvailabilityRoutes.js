const express = require("express");
const DoctorAvailability = require("../models/doctorAvailability");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// GET all doctor availability
router.get("/", async (req, res) => {
    try {
        const availability = await DoctorAvailability.find();

        res.status(200).json(availability);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching doctor availability",
            error: error.message
        });
    }
});


// POST doctor availability
router.post("/", authMiddleware,
    roleMiddleware("doctor"), async (req, res) => {
    try {
        const {
    day,
    startTime,
    endTime,
    isAvailable,
    leaveReason
} = req.body;

const doctorId = req.user.userId;

        const availability = new DoctorAvailability({
            doctorId,
            day,
            startTime,
            endTime,
            isAvailable,
            leaveReason
        });

        const savedAvailability = await availability.save();

        res.status(201).json(savedAvailability);

    } catch (error) {
        res.status(500).json({
            message: "Error creating doctor availability",
            error: error.message
        });
    }
});
// Get logged-in doctor's own availability
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const availability = await DoctorAvailability.find({
                doctorId: req.user.userId
            });

            res.status(200).json(availability);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching your availability",
                error: error.message
            });
        }
    }
);
// Doctor can update their own availability / leave
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("doctor"),
    async (req, res) => {
        try {
            const {
                startTime,
                endTime,
                isAvailable,
                leaveReason
            } = req.body;

            const availability = await DoctorAvailability.findOne({
                _id: req.params.id,
                doctorId: req.user.userId
            });

            if (!availability) {
                return res.status(404).json({
                    message: "Availability record not found"
                });
            }

            availability.startTime = startTime;
            availability.endTime = endTime;
            availability.isAvailable = isAvailable;
            availability.leaveReason = leaveReason;

            const updatedAvailability = await availability.save();

            res.status(200).json(updatedAvailability);

        } catch (error) {
            res.status(500).json({
                message: "Error updating availability",
                error: error.message
            });
        }
    }
);
module.exports = router;