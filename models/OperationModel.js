const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "C", // C means client
    },
    clientLocation: {
      type: Object,
      required: true,
    },
    availableUkils: {
      type: Array,
    },
    // availableUkils: [
    //   {
    //     ukil: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "B", // C means client
    //     },
    //     location: {
    //       type: Object,
    //     },
    //   },
    // ],
    averageCost: {
      type: String,
    },
    referenceCode: {
      type: String,
    },
    ukil: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "B", // B means ukil
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
