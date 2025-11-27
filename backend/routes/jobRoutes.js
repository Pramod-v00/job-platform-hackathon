const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobsByDistrict,
  deleteJob,
} = require("../controllers/jobController");
const auth = require("../middleware/authMiddleware");
const Job = require("../models/job");

// ===============================
// ⭐ CLOUDINARY SETUP
// ===============================
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ===============================
// ⭐ CLOUDINARY STORAGE
// ===============================
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Store images in "jobphotos", voices in "jobvoices"
    return {
      folder: file.mimetype.startsWith("image")
        ? "jobplatform/photos"
        : "jobplatform/voices",
      resource_type: file.mimetype.startsWith("image") ? "image" : "video",
    };
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
// ⭐ EDIT JOB (Only district change)
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
