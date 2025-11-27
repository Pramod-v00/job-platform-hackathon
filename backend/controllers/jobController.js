const Job = require("../models/job");
const cloudinary = require("cloudinary").v2;

// ======================
// ⭐ CREATE JOB (upload to Cloudinary)
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
      // ⭐ Cloudinary gives direct URL
      photoUrl: photoFile.path,
      voiceUrl: voiceFile ? voiceFile.path : "",

      postedBy,
      district,
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
// ⭐ GET JOBS BY DISTRICT (only approved jobs)
// ======================
exports.getJobsByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      const allJobs = await Job.find({ isApproved: true }).sort({
        createdAt: -1,
      });
      return res.json(allJobs);
    }

    const jobs = await Job.find({ district, isApproved: true }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// ⭐ DELETE JOB (User deletes their own post)
// ======================
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ============================
    // ⭐ DELETE CLOUDINARY FILES
    // ============================

    // Delete Photo
    if (job.photoUrl) {
      const publicId = job.photoUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`jobplatform/photos/${publicId}`, {
        resource_type: "image",
      });
    }

    // Delete Voice
    if (job.voiceUrl) {
      const publicId = job.voiceUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`jobplatform/voices/${publicId}`, {
        resource_type: "video",
      });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
