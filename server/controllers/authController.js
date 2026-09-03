const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");

async function register(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required.",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser(
      fullName,
      email,
      passwordHash,
      role || "technician"
    );

    res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Server error during registration.",
    });
  }
}

module.exports = {
  register,
};
