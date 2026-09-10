const {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  getJobsByTechnicianId,
} = require("../models/technicianModel");

async function addTechnician(req, res) {
  try {
    const { name, phone, email, specialization, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    const technician = await createTechnician(
      name,
      phone || null,
      email || null,
      specialization || null,
      status || "active"
    );

    res.status(201).json({
      message: "Technician created successfully.",
      technician,
    });
  } catch (error) {
    console.error("Create technician error:", error.message);

    res.status(500).json({
      message: "Server error while creating technician.",
    });
  }
}

async function listTechnicians(req, res) {
  try {
    const { search } = req.query;
    const technicians = await getAllTechnicians(search);

    res.json({
      technicians,
    });
  } catch (error) {
    console.error("Get technicians error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving technicians.",
    });
  }
}

async function getTechnician(req, res) {
  try {
    const technician = await getTechnicianById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found.",
      });
    }

    res.json({
      technician,
    });
  } catch (error) {
    console.error("Get technician error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving technician.",
    });
  }
}

async function editTechnician(req, res) {
  try {
    const { name, phone, email, specialization, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    const technician = await updateTechnician(
      req.params.id,
      name,
      phone || null,
      email || null,
      specialization || null,
      status || "active"
    );

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found.",
      });
    }

    res.json({
      message: "Technician updated successfully.",
      technician,
    });
  } catch (error) {
    console.error("Update technician error:", error.message);

    res.status(500).json({
      message: "Server error while updating technician.",
    });
  }
}

async function removeTechnician(req, res) {
  try {
    const technician = await deleteTechnician(req.params.id);

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found.",
      });
    }

    res.json({
      message: "Technician deleted successfully.",
      technician,
    });
  } catch (error) {
    console.error("Delete technician error:", error.message);

    res.status(500).json({
      message: "Server error while deleting technician.",
    });
  }
}

async function listTechnicianJobs(req, res) {
  try {
    const jobs = await getJobsByTechnicianId(req.params.id);

    res.json({
      jobs,
    });
  } catch (error) {
    console.error("Get technician jobs error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving technician's jobs.",
    });
  }
}

module.exports = {
  addTechnician,
  listTechnicians,
  getTechnician,
  editTechnician,
  removeTechnician,
  listTechnicianJobs,
};