const mongoose = require("mongoose");

const messages = new mongoose.Schema({
  username: String,
  message: String,
});

const newMsg = mongoose.model("newMsg", messages);
module.exports = newMsg;
