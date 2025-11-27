const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signup, login } = require("../controllers/userController");

// ===== Signup & Login =====
router.post("/signup", signup);
router.post("/login", login);

// ===== Multer setup for profile photo upload =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_photos/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Update profile (name, district, password, photo, workType) =====
router.put("/update/:phone", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { name, district, password, workType } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (district) updateData.district = district;
    if (workType) updateData.workType = workType;

    // ✅ Hash password only if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      updateData.profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
    }

    const updatedUser = await User.findOneAndUpdate(
      { phone: req.params.phone },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== 🔍 Search users by work type or name =====
router.get("/search/:query/:district", async (req, res) => {
  try {
    const query = req.params.query?.toLowerCase();
    const district = req.params.district;

    if (!query || !district) {
      return res.status(400).json({ message: "Query and district required" });
    }

    const users = await User.find({
      district,  // ⭐ filter by same district
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

// ===== 🔑 Reset Password (for 'Forgot Password') =====
router.put("/reset-password", async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    if (!phone || !newPassword) {
      return res.status(400).json({ message: "Phone and new password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
