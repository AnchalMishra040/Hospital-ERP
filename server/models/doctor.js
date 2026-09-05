const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Doctor", doctorSchema);