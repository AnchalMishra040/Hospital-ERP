const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorAvailabilityRoutes = require("./routes/doctorAvailabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/test", (req, res) => {
    res.send("SERVER TEST IS WORKING!");
});
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor-availability", doctorAvailabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);

// Basic test route
app.get("/", (req, res) => {
    res.send("Hospital ERP Backend is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });