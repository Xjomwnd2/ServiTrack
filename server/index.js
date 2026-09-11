const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const technicianRoutes = require("./routes/technicianRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — must come before routes
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ServiTrack API is running!"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/technicians", technicianRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`ServiTrack server running on http://localhost:${PORT}`);
});