// routes/jobs.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/jobs - list all jobs, with customer and technician names joined in
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name AS customer_name, t.name AS technician_name
       FROM jobs j
       JOIN customers c ON j.customer_id = c.customer_id
       LEFT JOIN technicians t ON j.technician_id = t.id
       ORDER BY j.job_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name AS customer_name, t.name AS technician_name
       FROM jobs j
       JOIN customers c ON j.customer_id = c.customer_id
       LEFT JOIN technicians t ON j.technician_id = t.id
       WHERE j.job_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs
// Valid status values (per DB constraint): new, scheduled, in_progress, completed
router.post('/', async (req, res) => {
  const {
    request_id, customer_id, technician_id, job_description,
    scheduled_date, scheduled_time, location, status,
  } = req.body;

  if (!request_id || !customer_id) {
    return res.status(400).json({ error: 'request_id and customer_id are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO jobs
         (request_id, customer_id, technician_id, job_description,
          scheduled_date, scheduled_time, location, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'scheduled'))
       RETURNING *`,
      [request_id, customer_id, technician_id, job_description,
        scheduled_date, scheduled_time, location, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job', detail: err.detail });
  }
});

// PUT /api/jobs/:id - commonly used to reassign a technician or change status
router.put('/:id', async (req, res) => {
  const {
    technician_id, job_description, scheduled_date,
    scheduled_time, location, status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE jobs
       SET technician_id = COALESCE($1, technician_id),
           job_description = COALESCE($2, job_description),
           scheduled_date = COALESCE($3, scheduled_date),
           scheduled_time = COALESCE($4, scheduled_time),
           location = COALESCE($5, location),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE job_id = $7
       RETURNING *`,
      [technician_id, job_description, scheduled_date, scheduled_time, location, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job', detail: err.detail });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE job_id = $1 RETURNING job_id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted', job_id: result.rows[0].job_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;
