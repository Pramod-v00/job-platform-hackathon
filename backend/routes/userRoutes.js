const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signup, login, updateUser } = require("../controllers/userController");

// =============================================
// ✅ CLOUDINARY CONFIG
// =============================================
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================================
// ✅ MULTER → CLOUDINARY STORAGE (for profile photos)
// =============================================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "jobplatform/profile_photos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// =============================================
// 🚀 ROUTES
// =============================================

// 👉 Signup
router.post("/signup", signup);

// 👉 Login
router.post("/login", login);

// 👉 Update profile (name, district, password, photo, workType)
router.put(
  "/update/:phone",
  upload.single("profilePhoto"),
  updateUser
);

// 👉 Search users by name or work type
router.get("/search/:query/:district", async (req, res) => {
  try {
    const query = req.params.query?.toLowerCase();
    const district = req.params.district;

    if (!query || !district) {
      return res.status(400).json({ message: "Query and district required" });
    }

    const users = await User.find({
      district,
      $or: [
        { workType: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("name phone district workType profilePhoto");

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Forgot password → Reset password
router.put("/reset-password", async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    if (!phone || !newPassword) {
      return res
        .status(400)
        .json({ message: "Phone and new password required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
