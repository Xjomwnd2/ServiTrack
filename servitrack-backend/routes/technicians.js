// routes/technicians.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/technicians - list all technicians
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM technicians ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// GET /api/technicians/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM technicians WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch technician' });
  }
});

// POST /api/technicians - create a new technician
router.post('/', async (req, res) => {
  const { name, phone, email, specialization, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO technicians (name, phone, email, specialization, status)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'active'))
       RETURNING *`,
      [name, phone, email, specialization, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create technician' });
  }
});

// PUT /api/technicians/:id - update a technician
router.put('/:id', async (req, res) => {
  const { name, phone, email, specialization, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE technicians
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           specialization = COALESCE($4, specialization),
           status = COALESCE($5, status)
       WHERE id = $6
       RETURNING *`,
      [name, phone, email, specialization, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update technician' });
  }
});

// DELETE /api/technicians/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM technicians WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json({ message: 'Technician deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete technician' });
  }
});

module.exports = router;
