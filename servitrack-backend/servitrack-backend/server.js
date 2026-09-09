// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json()); // parse JSON request bodies

// Route modules
const customersRouter = require('./routes/customers');
const techniciansRouter = require('./routes/technicians');
const serviceRequestsRouter = require('./routes/serviceRequests');
const jobsRouter = require('./routes/jobs');
const usersRouter = require('./routes/users');

app.use('/api/customers', customersRouter);
app.use('/api/technicians', techniciansRouter);
app.use('/api/service-requests', serviceRequestsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/users', usersRouter);

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'ServiTrack API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ServiTrack API listening on http://localhost:${PORT}`);
});
