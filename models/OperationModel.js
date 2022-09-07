const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    clientLocation: {
      type: Object,
      required: true,
    },
    avialableUkils: {
      type: Array,
    },
    averageCost: {
      type: String,
    },
    ukil: {
      type: String,
    },
    ukilLocation: {
      type: Object,
    },
    operationStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Operation", OperationSchema);
