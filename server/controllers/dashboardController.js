const { getDashboardStats } = require("../models/dashboardModel");

async function dashboardStats(req, res) {
  try {
    const dashboard = await getDashboardStats();

    res.json(dashboard);
  } catch (error) {
    console.error("Dashboard loading error:", error.message);

    res.status(500).json({
      message: "Server error while loading dashboard.",
    });
  }
}

module.exports = {
  dashboardStats,
};