const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");

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

// Customer routes
app.use("/api/customers", customerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`ServiTrack server running on http://localhost:${PORT}`);
});
