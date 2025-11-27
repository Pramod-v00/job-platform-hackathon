const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, access denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
