const mongoose = require("mongoose");

const code = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Code = mongoose.model("Code", code);
module.exports = Code;
