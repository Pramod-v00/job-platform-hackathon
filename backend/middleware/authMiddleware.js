// For prototype, simple check
const User = require("../models/user");

const auth = async (req, res, next) => {
  const phone = req.header("phone");
  if (!phone) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findOne({ phone });
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  req.user = user;
  next();
};

module.exports = auth;
