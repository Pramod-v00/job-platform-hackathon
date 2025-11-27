const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const Job = require("../models/job");
const fs = require("fs");
const path = require("path");

// Helper to delete files
const deleteFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, () => {});
};

// ===============================
// ⭐ Admin Login
// ===============================
router.post("/login", adminLogin);

// ===============================
// ⭐ Get all pending jobs
// ===============================
router.get("/pending-jobs", adminAuth, async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching pending jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ⭐ Approve job
// ===============================
router.put("/approve/:id", adminAuth, async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: "Job approved successfully" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ⭐ Reject job (Delete + remove files)
// ===============================
router.delete("/reject/:id", adminAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    deleteFile(job.photoUrl);
    deleteFile(job.voiceUrl);

    await job.deleteOne();
    res.json({ message: "Job rejected & deleted" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
