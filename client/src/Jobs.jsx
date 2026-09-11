import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

const STATUS_OPTIONS = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    requestId: "",
    customerId: "",
    technicianId: "",
    jobDescription: "",
    scheduledDate: "",
    scheduledTime: "",
    location: "",
    status: "scheduled",
  });

  async function loadData() {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoading(true);

    try {
      const [jobsResponse, requestsResponse, techniciansResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/jobs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
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
        setJobs(jobsData.jobs);
      } else {
        console.error(jobsData.message);
      }

      if (requestsResponse.ok) {
        setServiceRequests(requestsData.serviceRequests);
      }

      if (techniciansResponse.ok) {
        setTechnicians(techniciansData.technicians);
      }
    } catch (error) {
      console.error("Job loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleRequestChange(requestId) {
    const request = serviceRequests.find(
      (item) => String(item.request_id) === String(requestId)
    );

    setFormData({
      ...formData,
      requestId,
      customerId: request ? String(request.customer_id) : "",
      jobDescription: request ? request.description : formData.jobDescription,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          technicianId: formData.technicianId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to create job.");
        return;
      }

      alert("Job created successfully.");

      setFormData({
        requestId: "",
        customerId: "",
        technicianId: "",
        jobDescription: "",
        scheduledDate: "",
        scheduledTime: "",
        location: "",
        status: "scheduled",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Create job error:", error);
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
        body: JSON.stringify({ status: newStatus }),
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

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Jobs</h1>
          <p className="welcome">
            Schedule and track jobs created from service requests.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Job"}
        </button>
      </div>

      {showForm && (
        <div className="customer-form-card">
          <h2>Schedule a Job</h2>

          {serviceRequests.length === 0 ? (
            <p>
              You need an existing service request before scheduling a job.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Service Request *</label>

              <select
                value={formData.requestId}
                onChange={(event) => handleRequestChange(event.target.value)}
                required
              >
                <option value="">Select service request</option>

                {serviceRequests.map((request) => (
                  <option key={request.request_id} value={request.request_id}>
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
                  <option key={technician.id} value={technician.id}>
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
                  setFormData({ ...formData, location: event.target.value })
                }
                placeholder="Enter job location"
              />

              <button type="submit" className="primary-button">
                Create Job
              </button>
            </form>
          )}
        </div>
      )}

      <div className="customer-list-card">
        <div className="customer-list-header">
          <h2>Job List</h2>
        </div>

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
                      {new Date(job.scheduled_date).toLocaleDateString()}
                      {job.scheduled_time ? ` ${job.scheduled_time}` : ""}
                    </td>

                    <td>{job.location || "-"}</td>
                    <td>{job.technician_name || "-"}</td>

                    <td>
                      <select
                        value={job.status}
                        onChange={(event) =>
                          handleStatusChange(job.job_id, event.target.value)
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(job.job_id)}
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
    </div>
  );
}

export default Jobs;