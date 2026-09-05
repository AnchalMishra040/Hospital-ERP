const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin can view all users
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const users = await User.find().select("-password");

            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({
                message: "Error fetching users",
                error: error.message
            });
        }
    }
);
// POST route - create a user securely
router.post("/", async (req, res) => {
    try {
        const { userId, name, email, password, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userId,
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save user to MongoDB
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});
// LOGIN route
router.post("/login", async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Find user by userId
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login error",
            error: error.message
        });
    }
});
module.exports = router;