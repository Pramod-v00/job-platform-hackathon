const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobsByDistrict,
  deleteJob,
} = require("../controllers/jobController");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Job = require("../models/job");

// ===============================
// ⭐ MULTER STORAGE FOR PHOTO + VOICE
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/photos/");
    } else if (file.mimetype.startsWith("audio/")) {
      cb(null, "uploads/voice/");
    } else {
      cb(new Error("Invalid file type"), null);
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ===============================
// ⭐ CREATE JOB (photo + voice)
// ===============================
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  createJob
);

// ===============================
// ⭐ GET all jobs by user phone
// ===============================
router.get("/user/:phone", async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.phone });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ⭐ GET jobs by district
// ===============================
router.get("/", getJobsByDistrict);

// ===============================
// ⭐ EDIT job
// ===============================
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy !== req.user.phone) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { district } = req.body;
    if (district) job.district = district;

    await job.save();
    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ⭐ DELETE job (User)
// ===============================
router.delete("/:id", auth, deleteJob);

module.exports = router;
