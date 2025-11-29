const User = require("../models/user");
const Job = require("../models/job"); // ✅ IMPORTANT: You forgot this import!
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const SALT_ROUNDS = 10;

// ==========================
// ⭐ MULTER STORAGE
// ==========================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jobplatform/profile_photos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({ storage });

// ==========================
// ⭐ SIGNUP
// ==========================
exports.signup = async (req, res) => {
  try {
    const { phone, password, name, district, workType } = req.body;

    if (!phone || phone.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check existing user
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ⭐ FIXED: Save workType also
    const user = await User.create({
      phone,
      password: hashedPassword,
      name,
      district,
      workType: workType || "",
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    res.json(userSafe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==========================
// ⭐ LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const userSafe = user.toObject();
    delete userSafe.password;

    res.json(userSafe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==========================
// ⭐ UPDATE USER (Cloudinary Upload)
// ==========================
exports.updateUser = async (req, res) => {
  try {
    const phone = req.params.phone;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name
    if (req.body.name) user.name = req.body.name;

    // Update district + all jobs
    if (req.body.district) {
      await Job.updateMany(
        { postedBy: user.phone },
        { district: req.body.district }
      );
      user.district = req.body.district;
    }

    // Update password if not empty
    if (req.body.password && req.body.password.trim() !== "") {
      const hashed = await bcrypt.hash(req.body.password, 10);
      user.password = hashed;
    }

    // Update workType
    if (req.body.workType) user.workType = req.body.workType;

    // Remove old photo
    if (req.body.removePhoto === "true") {
      user.profilePhoto = "";
    }

    // ⭐ If a new profile photo uploaded → Cloudinary URL saved
    if (req.file) {
      user.profilePhoto = req.file.path; // Cloudinary auto gives full URL
    }

    const updated = await user.save();
    const userSafe = updated.toObject();
    delete userSafe.password;

    res.json(userSafe);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.upload = upload;
