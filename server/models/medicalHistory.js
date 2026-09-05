const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true
    },

    disease: {
      type: String,
      required: true
    },

    allergies: {
      type: String,
      default: "None"
    },

    medications: {
      type: String,
      default: "None"
    },

    previousSurgeries: {
      type: String,
      default: "None"
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);