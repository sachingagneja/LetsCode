const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  quesSolved: [{ name: String }],
  isAdmin: Boolean,
  quesSolvedNum: { easy: Number, medium: Number, hard: Number },
  reports: Number,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
