const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// ⭐ Admin Login (with auto-create default admin)
// ===============================
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Demo admin credentials (you will use these to login)
  const DEFAULT_ADMIN_EMAIL = "admin@jobplatform.com";
  const DEFAULT_ADMIN_PASSWORD = "Admin@123";

  try {
    // If no admin exists, automatically create one
    let admin = await Admin.findOne({ email: DEFAULT_ADMIN_EMAIL });

    if (!admin) {
      const hashedPass = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

      admin = new Admin({
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPass,
      });

      await admin.save();
      console.log("⭐ Default admin created in database");
    }

    // Check login email matches default
    if (email !== DEFAULT_ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, adminEmail: admin.email });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
