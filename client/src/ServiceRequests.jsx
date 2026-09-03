import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function ServiceRequests() {
  const [customers, setCustomers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    description: "",
    dateRequested: "",
    priority: "Medium",
    status: "New",
    assignedTechnician: "",
    notes: "",
  });

  async function loadData() {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoading(true);

    try {
      const [customersResponse, requestsResponse] = await Promise.all([
        fetch(`${API_URL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/service-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const customersData = await customersResponse.json();
      const requestsData = await requestsResponse.json();

      if (customersResponse.ok) {
        setCustomers(customersData.customers);
      }

      if (requestsResponse.ok) {
        setRequests(requestsData.serviceRequests);
      }
    } catch (error) {
      console.error("Service request loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/service-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to create service request.");
        return;
      }

      alert("Service request created successfully.");

      setFormData({
        customerId: "",
        description: "",
        dateRequested: "",
        priority: "Medium",
        status: "New",
        assignedTechnician: "",
        notes: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Create service request error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleDelete(requestId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service request?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/service-requests/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete service request.");
        return;
      }

      alert("Service request deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete service request error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Service Requests</h1>
          <p className="welcome">
            Manage customer service requests and track their progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Request"}
        </button>
      </div>

      {showForm && (
        <div className="customer-form-card">
          <h2>Create Service Request</h2>

          {customers.length === 0 ? (
            <p>
              You need to create a customer before creating a service request.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Customer *</label>

              <select
                value={formData.customerId}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    customerId: event.target.value,
                  })
                }
                required
              >
                <option value="">Select customer</option>

                {customers.map((customer) => (
                  <option
                    key={customer.customer_id}
                    value={customer.customer_id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>

              <label>Description *</label>

              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description: event.target.value,
                  })
                }
                placeholder="Describe the service needed"
                rows="4"
                required
              />

              <label>Date Requested *</label>

              <input
                type="date"
                value={formData.dateRequested}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    dateRequested: event.target.value,
                  })
                }
                required
              />

              <label>Priority</label>

              <select
                value={formData.priority}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    priority: event.target.value,
                  })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <label>Status</label>

              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    status: event.target.value,
                  })
                }
              >
                <option value="New">New</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <label>Assigned Technician</label>

              <input
                type="text"
                value={formData.assignedTechnician}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    assignedTechnician: event.target.value,
                  })
                }
                placeholder="Enter technician name"
              />

              <label>Notes</label>

              <textarea
                value={formData.notes}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    notes: event.target.value,
                  })
                }
                placeholder="Additional notes"
                rows="4"
              />

              <button type="submit" className="primary-button">
                Create Request
              </button>
            </form>
          )}
        </div>
      )}

      <div className="customer-list-card">
        <div className="customer-list-header">
          <h2>Service Request List</h2>
        </div>

        {loading ? (
          <p>Loading service requests...</p>
        ) : requests.length === 0 ? (
          <p>No service requests found.</p>
        ) : (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Technician</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.customer_name}</td>

                    <td>{request.description}</td>

                    <td>
                      {new Date(
                        request.date_requested
                      ).toLocaleDateString()}
                    </td>

                    <td>{request.priority}</td>

                    <td>{request.status}</td>

                    <td>{request.assigned_technician || "-"}</td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(request.request_id)
                        }
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

export default ServiceRequests;
