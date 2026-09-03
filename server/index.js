const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ServiTrack API is running!"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`ServiTrack server running on http://localhost:${PORT}`);
});
