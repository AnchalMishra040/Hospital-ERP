const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true
    },

    patientId: {
      type: String,
      required: true
    },

    doctorId: {
      type: String,
      required: true
    },

    appointmentDate: {
      type: String,
      required: true
    },

    appointmentTime: {
      type: String,
      required: true
    },

    reason: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Booked", "Completed", "Cancelled"],
      default: "Booked"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);