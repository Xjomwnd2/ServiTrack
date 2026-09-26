const pool = require("../db");

// Get all statistics needed by the ServiTrack dashboard
async function getDashboardStats() {
  const [
    customersResult,
    requestsResult,
    pendingRequestsResult,
    newRequestsResult,
    scheduledJobsResult,
    upcomingAppointmentsResult,
    jobsResult,
    completedJobsResult,
    activeTechniciansResult,
    monthlyPerformanceResult,
    recentJobsResult,
    recentRequestsResult,
  ] = await Promise.all([
    // Total customers
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM customers
    `),

    // Total service requests
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM service_requests
    `),

    // Pending service requests
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM service_requests
      WHERE status IN ('new', 'scheduled', 'in_progress')
    `),

    // New requests only
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM service_requests
      WHERE status = 'new'
    `),

    // Scheduled jobs only
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM jobs
      WHERE status = 'scheduled'
    `),

    // Upcoming appointments (future service requests)
    pool.query(`
      SELECT
        sr.request_id,
        sr.description,
        sr.date_requested,
        sr.priority,
        c.name AS customer_name,
        u.full_name AS assigned_technician
      FROM service_requests sr
      LEFT JOIN customers c
        ON sr.customer_id = c.customer_id
      LEFT JOIN users u
        ON sr.assigned_technician_id = u.user_id
      WHERE sr.date_requested >= CURRENT_DATE
      ORDER BY sr.date_requested ASC
      LIMIT 5
    `),

    // Total jobs
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM jobs
    `),

    // Completed jobs
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM jobs
      WHERE status = 'completed'
    `),

    // Active technicians
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM users
      WHERE role = 'technician'
    `),

    // Monthly job performance for the current year
    pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', scheduled_date), 'Mon') AS month,
        COUNT(*)::int AS total_jobs,
        COUNT(*) FILTER (
          WHERE status = 'completed'
        )::int AS completed_jobs
      FROM jobs
      WHERE scheduled_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', scheduled_date)
      ORDER BY DATE_TRUNC('month', scheduled_date)
    `),

    // Five most recent jobs
    pool.query(`
      SELECT
        j.job_id,
        j.job_description,
        j.scheduled_date,
        j.scheduled_time,
        j.status,
        c.name AS customer_name,
        u.full_name AS technician_name
      FROM jobs j
      LEFT JOIN customers c
        ON j.customer_id = c.customer_id
      LEFT JOIN users u
        ON j.technician_id = u.user_id
      ORDER BY j.created_at DESC
      LIMIT 5
    `),

    // Five most recent service requests
    pool.query(`
      SELECT
        sr.request_id,
        sr.description,
        sr.date_requested,
        sr.priority,
        sr.status,
        c.name AS customer_name,
        u.full_name AS technician_name
      FROM service_requests sr
      LEFT JOIN customers c
        ON sr.customer_id = c.customer_id
      LEFT JOIN users u
        ON sr.assigned_technician_id = u.user_id
      ORDER BY sr.created_at DESC
      LIMIT 5
    `),
  ]);

  return {
    totalCustomers: customersResult.rows[0].total,
    totalRequests: requestsResult.rows[0].total,
    pendingRequests: pendingRequestsResult.rows[0].total,
    newRequests: newRequestsResult.rows[0].total,
    scheduledJobs: scheduledJobsResult.rows[0].total,
    upcomingAppointments: upcomingAppointmentsResult.rows,
    totalJobs: jobsResult.rows[0].total,
    completedJobs: completedJobsResult.rows[0].total,
    activeTechnicians: activeTechniciansResult.rows[0].total,
    monthlyPerformance: monthlyPerformanceResult.rows,
    recentJobs: recentJobsResult.rows,
    recentRequests: recentRequestsResult.rows,
  };
}

module.exports = {
  getDashboardStats,
};