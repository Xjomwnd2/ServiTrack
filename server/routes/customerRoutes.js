const express = require("express");

const {
  addCustomer,
  listCustomers,
  getCustomer,
  editCustomer,
  removeCustomer,
} = require("../controllers/customerController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.post("/", addCustomer);
router.get("/", listCustomers);
router.get("/:id", getCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", removeCustomer);

module.exports = router;
