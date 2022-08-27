const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("B", DoctorSchema);
