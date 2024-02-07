const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    event: { type: String, required: true },
  },
  { timestamps: true }
);

const Log = new mongoose.model("logs", logSchema);

module.exports = Log;
