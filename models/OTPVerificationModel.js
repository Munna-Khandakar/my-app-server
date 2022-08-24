const mongoose = require("mongoose");

const mySchema = mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", mySchema);
