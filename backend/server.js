const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

// ⭐ CORS Setup (Works for Cloudinary + Vercel)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://job-platform-hackathon-766x.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "phone", "Authorization"],
  })
);

app.use(express.json());

// ⭐ No need for static uploads now (Cloudinary handles files)
// REMOVE THIS:
// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ⭐ API Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
