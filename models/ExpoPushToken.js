const mongoose = require("mongoose");

const mySchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    expoPushToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpoPushToken", mySchema);
