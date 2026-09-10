const pool = require("../db");

// Create a new job
async function createJob(
  requestId,
  customerId,
  technicianId,
  jobDescription,
  scheduledDate,
  scheduledTime,
  location,
  status
) {
  const result = await pool.query(
    `INSERT INTO jobs
      (request_id, customer_id, technician_id, job_description,
       scheduled_date, scheduled_time, location, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      requestId,
      customerId,
      technicianId,
      jobDescription,
      scheduledDate,
      scheduledTime,
      location,
      status,
    ]
  );

  return result.rows[0];
}

// Get all jobs
async function getAllJobs(search, status, technicianId) {
  let query = `
    SELECT
      j.*,
      c.name AS customer_name,
      c.phone AS customer_phone,
      u.full_name AS technician_name
    FROM jobs j
    LEFT JOIN customers c
      ON j.customer_id = c.customer_id
    LEFT JOIN users u
      ON j.technician_id = u.user_id
    WHERE 1 = 1
  `;

  const values = [];
  let parameterIndex = 1;

  // Search by job description or customer name
  if (search) {
    query += `
      AND (
        j.job_description ILIKE $${parameterIndex}
        OR c.name ILIKE $${parameterIndex}
      )
    `;

    values.push(`%${search}%`);
    parameterIndex++;
  }

  // Filter by status
  if (status) {
    query += ` AND j.status = $${parameterIndex}`;
    values.push(status);
    parameterIndex++;
  }

  // Filter by technician
  if (technicianId) {
    query += ` AND j.technician_id = $${parameterIndex}`;
    values.push(technicianId);
    parameterIndex++;
  }

  query += `
    ORDER BY j.scheduled_date ASC, j.scheduled_time ASC NULLS LAST
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

// Get one job by ID
async function getJobById(jobId) {
  const result = await pool.query(
    `
    SELECT
      j.*,
      c.name AS customer_name,
      c.phone AS customer_phone,
      c.email AS customer_email,
      u.full_name AS technician_name,
      u.email AS technician_email
    FROM jobs j
    LEFT JOIN customers c
      ON j.customer_id = c.customer_id
    LEFT JOIN users u
      ON j.technician_id = u.user_id
    WHERE j.job_id = $1
    `,
    [jobId]
  );

  return result.rows[0];
}

// Update a job
async function updateJob(
  jobId,
  requestId,
  customerId,
  technicianId,
  jobDescription,
  scheduledDate,
  scheduledTime,
  location
) {
  const result = await pool.query(
    `
    UPDATE jobs
    SET
      request_id = $1,
      customer_id = $2,
      technician_id = $3,
      job_description = $4,
      scheduled_date = $5,
      scheduled_time = $6,
      location = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE job_id = $8
    RETURNING *
    `,
    [
      requestId,
      customerId,
      technicianId,
      jobDescription,
      scheduledDate,
      scheduledTime,
      location,
      jobId,
    ]
  );

  return result.rows[0];
}

// Update job status and save status history
async function updateJobStatus(jobId, status, changedBy, notes) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update the job status
    const jobResult = await client.query(
      `
      UPDATE jobs
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE job_id = $2
      RETURNING *
      `,
      [status, jobId]
    );

    // Job not found
    if (jobResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    // Save the status change in history
    await client.query(
      `
      INSERT INTO job_status_history
        (job_id, status, changed_by, notes)
      VALUES ($1, $2, $3, $4)
      `,
      [jobId, status, changedBy, notes]
    );

    await client.query("COMMIT");

    return jobResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Get job status history
async function getJobStatusHistory(jobId) {
  const result = await pool.query(
    `
    SELECT
      h.*,
      u.full_name AS changed_by_name
    FROM job_status_history h
    LEFT JOIN users u
      ON h.changed_by = u.user_id
    WHERE h.job_id = $1
    ORDER BY h.changed_at DESC
    `,
    [jobId]
  );

  return result.rows;
}

// Delete a job
async function deleteJob(jobId) {
  const result = await pool.query(
    `
    DELETE FROM jobs
    WHERE job_id = $1
    RETURNING *
    `,
    [jobId]
  );

  return result.rows[0];
}

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  getJobStatusHistory,
  deleteJob,
};