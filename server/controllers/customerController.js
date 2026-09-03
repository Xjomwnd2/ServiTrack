const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../models/customerModel");

async function addCustomer(req, res) {
  try {
    const { name, phone, email, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    const customer = await createCustomer(
      name,
      phone || null,
      email || null,
      address || null,
      notes || null
    );

    res.status(201).json({
      message: "Customer created successfully.",
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error.message);

    res.status(500).json({
      message: "Server error while creating customer.",
    });
  }
}

async function listCustomers(req, res) {
  try {
    const search = req.query.search || "";

    const customers = await getAllCustomers(search);

    res.json({
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving customers.",
    });
  }
}

async function getCustomer(req, res) {
  try {
    const customer = await getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    res.json({
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving customer.",
    });
  }
}

async function editCustomer(req, res) {
  try {
    const { name, phone, email, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    const customer = await updateCustomer(
      req.params.id,
      name,
      phone || null,
      email || null,
      address || null,
      notes || null
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    res.json({
      message: "Customer updated successfully.",
      customer,
    });
  } catch (error) {
    console.error("Update customer error:", error.message);

    res.status(500).json({
      message: "Server error while updating customer.",
    });
  }
}

async function removeCustomer(req, res) {
  try {
    const customer = await deleteCustomer(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    res.json({
      message: "Customer deleted successfully.",
      customer,
    });
  } catch (error) {
    console.error("Delete customer error:", error.message);

    res.status(500).json({
      message: "Server error while deleting customer.",
    });
  }
}

module.exports = {
  addCustomer,
  listCustomers,
  getCustomer,
  editCustomer,
  removeCustomer,
};
