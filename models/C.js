const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
    geoLocation: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
    },
    photo: {
      type: String,
    },
    email: {
      type: String,
    },
    experience: {
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

module.exports = mongoose.model("C", UserSchema);
