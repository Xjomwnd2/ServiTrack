// routes/serviceRequests.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/service-requests - list all, with customer name joined in
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, c.name AS customer_name
       FROM service_requests sr
       JOIN customers c ON sr.customer_id = c.customer_id
       ORDER BY sr.request_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// GET /api/service-requests/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, c.name AS customer_name
       FROM service_requests sr
       JOIN customers c ON sr.customer_id = c.customer_id
       WHERE sr.request_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

// POST /api/service-requests
// Valid status values (per DB constraint): new, scheduled, in_progress, completed
// Valid priority values: low, medium, high
router.post('/', async (req, res) => {
  const { customer_id, description, priority, status } = req.body;
  if (!customer_id) {
    return res.status(400).json({ error: 'customer_id is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO service_requests (customer_id, description, priority, status)
       VALUES ($1, $2, COALESCE($3, 'medium'), COALESCE($4, 'new'))
       RETURNING *`,
      [customer_id, description, priority, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service request', detail: err.detail });
  }
});

// PUT /api/service-requests/:id
router.put('/:id', async (req, res) => {
  const { description, priority, status, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE service_requests
       SET description = COALESCE($1, description),
           priority = COALESCE($2, priority),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes)
       WHERE request_id = $5
       RETURNING *`,
      [description, priority, status, notes, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service request', detail: err.detail });
  }
});

// DELETE /api/service-requests/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM service_requests WHERE request_id = $1 RETURNING request_id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json({ message: 'Service request deleted', request_id: result.rows[0].request_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service request' });
  }
});

module.exports = router;
