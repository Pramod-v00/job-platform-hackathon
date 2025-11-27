const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  workType: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
