const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@example.com";   // change if needed
  const password = "Admin123";         // change if needed

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({ email, password: hashedPassword });

  console.log("Admin created successfully!");
  process.exit();
}

createAdmin();
