const pool = require("../db");

async function createCustomer(name, phone, email, address, notes) {
  const result = await pool.query(
    `INSERT INTO customers (name, phone, email, address, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, phone, email, address, notes]
  );

  return result.rows[0];
}

async function getAllCustomers(search = "") {
  const result = await pool.query(
    `SELECT *
     FROM customers
     WHERE name ILIKE $1
        OR phone ILIKE $1
        OR email ILIKE $1
     ORDER BY name ASC`,
    [`%${search}%`]
  );

  return result.rows;
}

async function getCustomerById(customerId) {
  const result = await pool.query(
    `SELECT *
     FROM customers
     WHERE customer_id = $1`,
    [customerId]
  );

  return result.rows[0];
}

async function updateCustomer(
  customerId,
  name,
  phone,
  email,
  address,
  notes
) {
  const result = await pool.query(
    `UPDATE customers
     SET name = $1,
         phone = $2,
         email = $3,
         address = $4,
         notes = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE customer_id = $6
     RETURNING *`,
    [name, phone, email, address, notes, customerId]
  );

  return result.rows[0];
}

async function deleteCustomer(customerId) {
  const result = await pool.query(
    `DELETE FROM customers
     WHERE customer_id = $1
     RETURNING *`,
    [customerId]
  );

  return result.rows[0];
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
