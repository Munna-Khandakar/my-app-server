const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    location: {
      type: Object,
    },
    charge: {
      type: String,
    },
    available: {
      type: String,
    },
    sysId: {
      type: String,
    },
    photo: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    experience: {
      type: String,
    },
    designation: {
      type: String,
    },
    nid: {
      type: String,
    },
    presentAddressDetails: {
      type: String,
    },
    permanentAddressDetails: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("B", DoctorSchema);
