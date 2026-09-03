const {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  deleteServiceRequest,
} = require("../models/serviceRequestModel");

async function addServiceRequest(req, res) {
  try {
    const {
      customerId,
      description,
      dateRequested,
      priority,
      status,
      assignedTechnician,
      notes,
    } = req.body;

    if (!customerId || !description || !dateRequested) {
      return res.status(400).json({
        message: "Customer, description, and date requested are required.",
      });
    }

    const serviceRequest = await createServiceRequest(
      customerId,
      description,
      dateRequested,
      priority || "Medium",
      status || "New",
      assignedTechnician || null,
      notes || null
    );

    res.status(201).json({
      message: "Service request created successfully.",
      serviceRequest,
    });
  } catch (error) {
    console.error("Create service request error:", error.message);

    res.status(500).json({
      message: "Server error while creating service request.",
    });
  }
}

async function listServiceRequests(req, res) {
  try {
    const serviceRequests = await getAllServiceRequests();

    res.json({
      serviceRequests,
    });
  } catch (error) {
    console.error("Get service requests error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving service requests.",
    });
  }
}

async function getServiceRequest(req, res) {
  try {
    const serviceRequest = await getServiceRequestById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found.",
      });
    }

    res.json({
      serviceRequest,
    });
  } catch (error) {
    console.error("Get service request error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving service request.",
    });
  }
}

async function editServiceRequest(req, res) {
  try {
    const {
      customerId,
      description,
      dateRequested,
      priority,
      status,
      assignedTechnician,
      notes,
    } = req.body;

    if (!customerId || !description || !dateRequested) {
      return res.status(400).json({
        message: "Customer, description, and date requested are required.",
      });
    }

    const serviceRequest = await updateServiceRequest(
      req.params.id,
      customerId,
      description,
      dateRequested,
      priority || "Medium",
      status || "New",
      assignedTechnician || null,
      notes || null
    );

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found.",
      });
    }

    res.json({
      message: "Service request updated successfully.",
      serviceRequest,
    });
  } catch (error) {
    console.error("Update service request error:", error.message);

    res.status(500).json({
      message: "Server error while updating service request.",
    });
  }
}

async function removeServiceRequest(req, res) {
  try {
    const serviceRequest = await deleteServiceRequest(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found.",
      });
    }

    res.json({
      message: "Service request deleted successfully.",
      serviceRequest,
    });
  } catch (error) {
    console.error("Delete service request error:", error.message);

    res.status(500).json({
      message: "Server error while deleting service request.",
    });
  }
}

module.exports = {
  addServiceRequest,
  listServiceRequests,
  getServiceRequest,
  editServiceRequest,
  removeServiceRequest,
};
