const Job = require("../models/job");
const fs = require("fs");
const path = require("path");

// ======================
// ⭐ Helper: Delete stored files
// ======================
const deleteFile = (filePath) => {
  if (!filePath) return;

  // filePath = "/uploads/photos/xxx.jpg"
  const fullPath = path.join(__dirname, "..", filePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.log("❌ Failed to delete:", fullPath);
    } else {
      console.log("🗑️ Deleted:", fullPath);
    }
  });
};

// ======================
// ⭐ CREATE JOB (photo + voice only)
// ======================
exports.createJob = async (req, res) => {
  const { postedBy, district } = req.body;

  const photoFile = req.files?.photo ? req.files.photo[0] : null;
  const voiceFile = req.files?.voice ? req.files.voice[0] : null;

  if (!photoFile || !postedBy || !district) {
    return res
      .status(400)
      .json({ message: "Photo, postedBy, and district are required" });
  }

  try {
    const job = await Job.create({
      photoUrl: `/uploads/photos/${photoFile.filename}`,
      voiceUrl: voiceFile ? `/uploads/voice/${voiceFile.filename}` : "",

      postedBy,
      district,

      // ⭐ NOT approved by default
      isApproved: false,

      createdAt: new Date(),
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// ⭐ GET JOBS BY DISTRICT (ONLY approved jobs)
// ======================
exports.getJobsByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    // If no district → return all approved jobs
    if (!district) {
      const allJobs = await Job.find({ isApproved: true }).sort({ createdAt: -1 });
      return res.json(allJobs);
    }

    const jobs = await Job.find({ district, isApproved: true }).sort({ createdAt: -1 });
    res.json(jobs);

  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// ⭐ DELETE job (User deleting their own post)
// ======================
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Delete files stored in backend
    deleteFile(job.photoUrl);
    deleteFile(job.voiceUrl);

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });

  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
