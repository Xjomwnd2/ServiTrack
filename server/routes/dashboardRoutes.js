const express = require("express");

const { dashboardStats } = require("../controllers/dashboardController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.get("/", dashboardStats);

module.exports = router;