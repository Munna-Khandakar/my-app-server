const mongoose = require("mongoose");

const CallQueueSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "C", // C means client
    },
    ukil: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "B", // B means ukil
    },
    callStatus: {
      type: String,
    },
    charge: {
      type: String, // incoming timeout cancel
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallQueue", CallQueueSchema);
