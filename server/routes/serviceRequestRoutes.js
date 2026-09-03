const express = require("express");

const {
  addServiceRequest,
  listServiceRequests,
  getServiceRequest,
  editServiceRequest,
  removeServiceRequest,
} = require("../controllers/serviceRequestController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.post("/", addServiceRequest);
router.get("/", listServiceRequests);
router.get("/:id", getServiceRequest);
router.put("/:id", editServiceRequest);
router.delete("/:id", removeServiceRequest);

module.exports = router;
