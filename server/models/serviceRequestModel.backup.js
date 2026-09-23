const pool = require("../db");

async function createServiceRequest(
  customerId,
  description,
  dateRequested,
  priority,
  status,
  assignedTechnician,
  notes
) {
  const result = await pool.query(
    `INSERT INTO service_requests
      (customer_id, description, date_requested, priority, status, assigned_technician, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      customerId,
      description,
      dateRequested,
      priority,
      status,
      assignedTechnician,
      notes,
    ]
  );

  return result.rows[0];
}

async function getAllServiceRequests() {
  const result = await pool.query(
    `SELECT
        sr.*,
        c.name AS customer_name
     FROM service_requests sr
     JOIN customers c
       ON sr.customer_id = c.customer_id
     ORDER BY sr.date_requested DESC`
  );

  return result.rows;
}

async function getServiceRequestById(requestId) {
  const result = await pool.query(
    `SELECT
        sr.*,
        c.name AS customer_name
     FROM service_requests sr
     JOIN customers c
       ON sr.customer_id = c.customer_id
     WHERE sr.request_id = $1`,
    [requestId]
  );

  return result.rows[0];
}

async function updateServiceRequest(
  requestId,
  customerId,
  description,
  dateRequested,
  priority,
  status,
  assignedTechnician,
  notes
) {
  const result = await pool.query(
    `UPDATE service_requests
     SET customer_id = $1,
         description = $2,
         date_requested = $3,
         priority = $4,
         status = $5,
         assigned_technician = $6,
         notes = $7
     WHERE request_id = $8
     RETURNING *`,
    [
      customerId,
      description,
      dateRequested,
      priority,
      status,
      assignedTechnician,
      notes,
      requestId,
    ]
  );

  return result.rows[0];
}

async function deleteServiceRequest(requestId) {
  const result = await pool.query(
    `DELETE FROM service_requests
     WHERE request_id = $1
     RETURNING *`,
    [requestId]
  );

  return result.rows[0];
}

module.exports = {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  deleteServiceRequest,
};
