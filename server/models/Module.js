// This file defines the week schema for the Pave application.
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    title: {
      type: String,
      required: true, // Example: "Week 1"
      trim: true,
    },
    order: {
      type: Number,
      required: true, // 1, 2, 3...
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Module", moduleSchema);
