const pool = require("../db");

// Create a technician
async function createTechnician(name, phone, email, specialization, status) {
  const result = await pool.query(
    `
    INSERT INTO technicians (name, phone, email, specialization, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, phone, email, specialization, status
    `,
    [name, phone, email, specialization, status]
  );

  return result.rows[0];
}

// Get all technicians
async function getAllTechnicians(search) {
  let query = `
    SELECT id, name, phone, email, specialization, status
    FROM technicians
    WHERE 1 = 1
  `;

  const values = [];

  if (search) {
    query += ` AND name ILIKE $1`;
    values.push(`%${search}%`);
  }

  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, values);

  return result.rows;
}

// Get one technician
async function getTechnicianById(technicianId) {
  const result = await pool.query(
    `
    SELECT id, name, phone, email, specialization, status
    FROM technicians
    WHERE id = $1
    `,
    [technicianId]
  );

  return result.rows[0];
}

// Update technician
async function updateTechnician(technicianId, name, phone, email, specialization, status) {
  const result = await pool.query(
    `
    UPDATE technicians
    SET
      name = $1,
      phone = $2,
      email = $3,
      specialization = $4,
      status = $5
    WHERE id = $6
    RETURNING id, name, phone, email, specialization, status
    `,
    [name, phone, email, specialization, status, technicianId]
  );

  return result.rows[0];
}

// Delete technician
async function deleteTechnician(technicianId) {
  const result = await pool.query(
    `
    DELETE FROM technicians
    WHERE id = $1
    RETURNING id, name, phone, email, specialization, status
    `,
    [technicianId]
  );

  return result.rows[0];
}

// Get jobs assigned to a technician
async function getJobsByTechnicianId(technicianId) {
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
  getJobsByTechnicianId,
};