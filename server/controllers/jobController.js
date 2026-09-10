const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  getJobStatusHistory,
  deleteJob,
} = require("../models/jobModel");

async function addJob(req, res) {
  try {
    const {
      requestId,
      customerId,
      technicianId,
      jobDescription,
      scheduledDate,
      scheduledTime,
      location,
      status,
    } = req.body;

    if (!requestId || !customerId || !jobDescription || !scheduledDate) {
      return res.status(400).json({
        message: "requestId, customerId, jobDescription, and scheduledDate are required.",
      });
    }

    const job = await createJob(
      requestId,
      customerId,
      technicianId || null,
      jobDescription,
      scheduledDate,
      scheduledTime || null,
      location || null,
      status || "scheduled"
    );

    res.status(201).json({
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    res.status(500).json({
      message: "Server error while creating job.",
    });
  }
}

async function listJobs(req, res) {
  try {
    const { search, status, technicianId } = req.query;
    const jobs = await getAllJobs(search, status, technicianId);

    res.json({
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving jobs.",
    });
  }
}

async function getJob(req, res) {
  try {
    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.json({
      job,
    });
  } catch (error) {
    console.error("Get job error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving job.",
    });
  }
}

async function editJob(req, res) {
  try {
    const {
      requestId,
      customerId,
      technicianId,
      jobDescription,
      scheduledDate,
      scheduledTime,
      location,
    } = req.body;

    if (!requestId || !customerId || !jobDescription || !scheduledDate) {
      return res.status(400).json({
        message: "requestId, customerId, jobDescription, and scheduledDate are required.",
      });
    }

    const job = await updateJob(
      req.params.id,
      requestId,
      customerId,
      technicianId || null,
      jobDescription,
      scheduledDate,
      scheduledTime || null,
      location || null
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.json({
      message: "Job updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error.message);

    res.status(500).json({
      message: "Server error while updating job.",
    });
  }
}

async function changeJobStatus(req, res) {
  try {
    const { status, notes } = req.body;
    const changedBy = req.user?.user_id || null;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
      });
    }

    const job = await updateJobStatus(req.params.id, status, changedBy, notes || null);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.json({
      message: "Job status updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Update job status error:", error.message);

    res.status(500).json({
      message: "Server error while updating job status.",
    });
  }
}

async function listJobHistory(req, res) {
  try {
    const history = await getJobStatusHistory(req.params.id);

    res.json({
      history,
    });
  } catch (error) {
    console.error("Get job status history error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving job status history.",
    });
  }
}

async function removeJob(req, res) {
  try {
    const job = await deleteJob(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.json({
      message: "Job deleted successfully.",
      job,
    });
  } catch (error) {
    console.error("Delete job error:", error.message);

    res.status(500).json({
      message: "Server error while deleting job.",
    });
  }
}

module.exports = {
  addJob,
  listJobs,
  getJob,
  editJob,
  changeJobStatus,
  listJobHistory,
  removeJob,
};