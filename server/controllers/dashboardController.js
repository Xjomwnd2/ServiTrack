const { getDashboardStats } = require("../models/dashboardModel");

async function dashboardStats(req, res) {
  try {
    const dashboard = await getDashboardStats();

    res.json({
      stats: {
        total_customers: dashboard.totalCustomers,
        new_requests: dashboard.newRequests,
        scheduled_jobs: dashboard.scheduledJobs,
        completed_jobs: dashboard.completedJobs,
      },
      appointments: dashboard.upcomingAppointments,
    });
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