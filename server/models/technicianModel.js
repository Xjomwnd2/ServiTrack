const pool = require("../db");

// Create a technician
async function createTechnician(fullName, email, passwordHash) {
  const result = await pool.query(
    `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, 'technician')
    RETURNING user_id, full_name, email, role, created_at
    `,
    [fullName, email, passwordHash]
  );

  return result.rows[0];
}

// Get all technicians
async function getAllTechnicians() {
  const result = await pool.query(
    `
    SELECT
      user_id,
      full_name,
      email,
      role,
      created_at
    FROM users
    WHERE role = 'technician'
    ORDER BY full_name ASC
    `
  );

  return result.rows;
}

// Get one technician
async function getTechnicianById(technicianId) {
  const result = await pool.query(
    `
    SELECT
      user_id,
      full_name,
      email,
      role,
      created_at
    FROM users
    WHERE user_id = $1
      AND role = 'technician'
    `,
    [technicianId]
  );

  return result.rows[0];
}

// Update technician
async function updateTechnician(technicianId, fullName, email) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      full_name = $1,
      email = $2
    WHERE user_id = $3
      AND role = 'technician'
    RETURNING user_id, full_name, email, role, created_at
    `,
    [fullName, email, technicianId]
  );

  return result.rows[0];
}

// Delete technician
async function deleteTechnician(technicianId) {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE user_id = $1
      AND role = 'technician'
    RETURNING user_id, full_name, email, role
    `,
    [technicianId]
  );

  return result.rows[0];
}

// Get jobs assigned to a technician
async function getTechnicianJobs(technicianId) {
  const result = await pool.query(
    `
    SELECT
      j.*,
      c.name AS customer_name,
      c.phone AS customer_phone
    FROM jobs j
    LEFT JOIN customers c
      ON j.customer_id = c.customer_id
    WHERE j.technician_id = $1
    ORDER BY j.scheduled_date ASC, j.scheduled_time ASC NULLS LAST
    `,
    [technicianId]
  );

  return result.rows;
}

module.exports = {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  getTechnicianJobs,
};