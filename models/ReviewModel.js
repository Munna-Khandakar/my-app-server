const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: String,
    },
    ratings: {
      type: Number,
    },
    review: {
      type: String,
    },
    receiver: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
