const mongoose = require("mongoose");

const contributedQues = new mongoose.Schema({
  contributedBy: String,
  quesName: String,
  description: String,
  isApproved: Boolean,
});

const userQuestion = mongoose.model("userQuestion", contributedQues);
module.exports = userQuestion;
