import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

const STATUS_OPTIONS = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

const EMPTY_FORM = {
  requestId: "",
  customerId: "",
  technicianId: "",
  jobDescription: "",
  scheduledDate: "",
  scheduledTime: "",
  location: "",
  status: "scheduled",
};

function formatStatus(status) {
  return status
    ? status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "-";
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");

  const [showHistory, setShowHistory] = useState(false);
  const [historyJob, setHistoryJob] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  async function loadData() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const jobQuery = new URLSearchParams();

      if (search.trim()) {
        jobQuery.append("search", search.trim());
      }

      if (statusFilter) {
        jobQuery.append("status", statusFilter);
      }

      if (technicianFilter) {
        jobQuery.append("technicianId", technicianFilter);
      }

      const queryString = jobQuery.toString();

      const [jobsResponse, requestsResponse, techniciansResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/jobs${queryString ? `?${queryString}` : ""}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(`${API_URL}/api/service-requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/technicians`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const jobsData = await jobsResponse.json();
      const requestsData = await requestsResponse.json();
      const techniciansData = await techniciansResponse.json();

      if (jobsResponse.ok) {
        setJobs(jobsData.jobs || []);
      } else {
        console.error(jobsData.message);
      }

      if (requestsResponse.ok) {
        setServiceRequests(requestsData.serviceRequests || []);
      }

      if (techniciansResponse.ok) {
        setTechnicians(techniciansData.technicians || []);
      }
    } catch (error) {
      console.error("Job loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [search, statusFilter, technicianFilter]);

  function handleRequestChange(requestId) {
    const request = serviceRequests.find(
      (item) => String(item.request_id) === String(requestId)
    );

    setFormData((previous) => ({
      ...previous,
      requestId,
      customerId: request ? String(request.customer_id) : "",
      jobDescription: request
        ? request.description
        : previous.jobDescription,
    }));
  }

  function resetForm() {
    setFormData(EMPTY_FORM);
    setEditingJobId(null);
    setShowForm(false);
  }

  function handleEdit(job) {
    setFormData({
      requestId: job.request_id ? String(job.request_id) : "",
      customerId: job.customer_id ? String(job.customer_id) : "",
      technicianId: job.technician_id ? String(job.technician_id) : "",
      jobDescription: job.job_description || "",
      scheduledDate: job.scheduled_date
        ? String(job.scheduled_date).substring(0, 10)
        : "",
      scheduledTime: job.scheduled_time
        ? String(job.scheduled_time).substring(0, 5)
        : "",
      location: job.location || "",
      status: job.status || "scheduled",
    });

    setEditingJobId(job.job_id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const isEditing = Boolean(editingJobId);

      const response = await fetch(
        isEditing
          ? `${API_URL}/api/jobs/${editingJobId}`
          : `${API_URL}/api/jobs`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            technicianId: formData.technicianId || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            (isEditing
              ? "Unable to update job."
              : "Unable to create job.")
        );
        return;
      }

      alert(
        isEditing
          ? "Job updated successfully."
          : "Job created successfully."
      );

      resetForm();

      await loadData();
    } catch (error) {
      console.error("Save job error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleStatusChange(jobId, newStatus) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update job status.");
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Update job status error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleDelete(jobId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete job.");
        return;
      }

      alert("Job deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete job error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleHistory(job) {
    const token = localStorage.getItem("token");

    setHistoryJob(job);
    setShowHistory(true);
    setHistoryLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${job.job_id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load job history.");
        return;
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error("Job history error:", error);
      alert("Unable to connect to the ServiTrack server.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function closeHistory() {
    setShowHistory(false);
    setHistoryJob(null);
    setHistory([]);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Jobs</h1>
          <p className="welcome">
            Schedule, assign, and track service jobs.
          </p>
        </div>

        <div>
          <button
            className="primary-button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingJobId(null);
                setFormData(EMPTY_FORM);
                setShowForm(true);
              }
            }}
          >
            {showForm
              ? "Cancel"
              : "+ New Job"}
          </button>

          <button
            className="secondary-button"
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ marginLeft: "10px" }}
          >
            {showCalendar ? "Hide Calendar" : "View Calendar"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="customer-form-card">
          <h2>{editingJobId ? "Edit Job" : "Schedule a Job"}</h2>

          {serviceRequests.length === 0 ? (
            <p>
              You need an existing service request before scheduling a job.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Service Request *</label>

              <select
                value={formData.requestId}
                onChange={(event) =>
                  handleRequestChange(event.target.value)
                }
                required
              >
                <option value="">Select service request</option>

                {serviceRequests.map((request) => (
                  <option
                    key={request.request_id}
                    value={request.request_id}
                  >
                    {request.customer_name} - {request.description}
                  </option>
                ))}
              </select>

              <label>Job Description *</label>

              <textarea
                value={formData.jobDescription}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    jobDescription: event.target.value,
                  })
                }
                placeholder="Describe the job"
                rows="4"
                required
              />

              <label>Technician</label>

              <select
                value={formData.technicianId}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    technicianId: event.target.value,
                  })
                }
              >
                <option value="">Unassigned</option>

                {technicians.map((technician) => (
                  <option
                    key={technician.id}
                    value={technician.id}
                  >
                    {technician.name}
                  </option>
                ))}
              </select>

              <label>Scheduled Date *</label>

              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    scheduledDate: event.target.value,
                  })
                }
                required
              />

              <label>Scheduled Time</label>

              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    scheduledTime: event.target.value,
                  })
                }
              />

              <label>Location</label>

              <input
                type="text"
                value={formData.location}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    location: event.target.value,
                  })
                }
                placeholder="Enter job location"
              />

              <div style={{ marginTop: "15px" }}>
                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingJobId ? "Update Job" : "Create Job"}
                </button>

                {editingJobId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetForm}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      <div className="customer-list-card">
        <div className="customer-list-header">
          <h2>Job Management</h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search customer or job..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ flex: "1", minWidth: "220px" }}
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">All Statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          <select
            value={technicianFilter}
            onChange={(event) =>
              setTechnicianFilter(event.target.value)
            }
          >
            <option value="">All Technicians</option>

            {technicians.map((technician) => (
              <option
                key={technician.id}
                value={technician.id}
              >
                {technician.name}
              </option>
            ))}
          </select>
        </div>

        {showCalendar && (
          <div
            className="customer-form-card"
            style={{ marginBottom: "20px" }}
          >
            <h2>Job Schedule</h2>

            {jobs.length === 0 ? (
              <p>No scheduled jobs found.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {jobs.map((job) => (
                  <div
                    key={job.job_id}
                    style={{
                      padding: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>
                      {formatDate(job.scheduled_date)}
                    </strong>

                    {job.scheduled_time && (
                      <span>
                        {" "}
                        at {String(job.scheduled_time).substring(0, 5)}
                      </span>
                    )}

                    <div>
                      {job.customer_name || "Unknown customer"}
                      {" — "}
                      {job.technician_name || "Unassigned"}
                    </div>

                    <div>{job.job_description}</div>

                    <small>
                      {job.location || "Location not provided"}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Description</th>
                  <th>Scheduled</th>
                  <th>Location</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.job_id}>
                    <td>{job.customer_name || "-"}</td>

                    <td>{job.job_description}</td>

                    <td>
                      {formatDate(job.scheduled_date)}

                      {job.scheduled_time
                        ? ` ${String(job.scheduled_time).substring(
                            0,
                            5
                          )}`
                        : ""}
                    </td>

                    <td>{job.location || "-"}</td>

                    <td>{job.technician_name || "Unassigned"}</td>

                    <td>
                      <select
                        value={job.status}
                        onChange={(event) =>
                          handleStatusChange(
                            job.job_id,
                            event.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {formatStatus(option)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="primary-button"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => handleHistory(job)}
                        style={{ marginLeft: "5px" }}
                      >
                        History
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(job.job_id)
                        }
                        style={{ marginLeft: "5px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showHistory && historyJob && (
        <div
          className="customer-form-card"
          style={{ marginTop: "20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Job Status History</h2>

            <button
              className="secondary-button"
              onClick={closeHistory}
            >
              Close
            </button>
          </div>

          <p>
            <strong>Customer:</strong>{" "}
            {historyJob.customer_name || "-"}
          </p>

          <p>
            <strong>Job:</strong>{" "}
            {historyJob.job_description}
          </p>

          {historyLoading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No status history available.</p>
          ) : (
            <div className="customer-table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Changed By</th>
                    <th>Notes</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item.history_id || `${item.job_id}-${item.changed_at}`}>
                      <td>{formatStatus(item.status)}</td>
                      <td>{item.changed_by_name || "-"}</td>
                      <td>{item.notes || "-"}</td>
                      <td>
                        {item.changed_at
                          ? new Date(
                              item.changed_at
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;