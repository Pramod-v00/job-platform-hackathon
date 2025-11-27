const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  photoUrl: { type: String, required: true },
  voiceUrl: { type: String, default: "" },

  postedBy: { type: String, required: true },
  district: { type: String, required: true },

  // ⭐ Admin Approval System
  isApproved: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
