const express = require("express");

const {
  addTechnician,
  listTechnicians,
  getTechnician,
  editTechnician,
  removeTechnician,
  listTechnicianJobs,
} = require("../controllers/technicianController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.post("/", addTechnician);
router.get("/", listTechnicians);
router.get("/:id", getTechnician);
router.get("/:id/jobs", listTechnicianJobs);
router.put("/:id", editTechnician);
router.delete("/:id", removeTechnician);

module.exports = router;