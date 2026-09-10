const express = require("express");

const {
  addJob,
  listJobs,
  getJob,
  editJob,
  changeJobStatus,
  listJobHistory,
  removeJob,
} = require("../controllers/jobController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.post("/", addJob);
router.get("/", listJobs);
router.get("/:id", getJob);
router.get("/:id/history", listJobHistory);
router.put("/:id", editJob);
router.patch("/:id/status", changeJobStatus);
router.delete("/:id", removeJob);

module.exports = router;