// routes/customers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/customers - list all customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers ORDER BY customer_id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - get one customer
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers - create a new customer
router.post('/', async (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO customers (name, phone, email, address, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, phone, email, address, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id - update a customer
router.put('/:id', async (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           address = COALESCE($4, address),
           notes = COALESCE($5, notes),
           updated_at = NOW()
       WHERE customer_id = $6
       RETURNING *`,
      [name, phone, email, address, notes, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id - delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted', customer_id: result.rows[0].customer_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

module.exports = router;
