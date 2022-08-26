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
    userName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("C", UserSchema);
