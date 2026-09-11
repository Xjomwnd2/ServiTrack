import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialization: "",
    status: "active",
  });

  async function loadTechnicians() {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/technicians`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setTechnicians(data.technicians);
    } catch (error) {
      console.error("Technician loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTechnicians();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/technicians`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to add technician.");
        return;
      }

      alert("Technician added successfully.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        specialization: "",
        status: "active",
      });

      setShowForm(false);

      await loadTechnicians();
    } catch (error) {
      console.error("Create technician error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  function startEditing(technician) {
    setEditingTechnician({
      id: technician.id,
      name: technician.name || "",
      phone: technician.phone || "",
      email: technician.email || "",
      specialization: technician.specialization || "",
      status: technician.status || "active",
    });

    setShowForm(false);
  }

  function cancelEditing() {
    setEditingTechnician(null);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/technicians/${editingTechnician.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingTechnician.name,
            phone: editingTechnician.phone,
            email: editingTechnician.email,
            specialization: editingTechnician.specialization,
            status: editingTechnician.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update technician.");
        return;
      }

      alert("Technician updated successfully.");

      setEditingTechnician(null);

      await loadTechnicians();
    } catch (error) {
      console.error("Update technician error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleDelete(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/technicians/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete technician.");
        return;
      }

      alert("Technician deleted successfully.");

      await loadTechnicians();
    } catch (error) {
      console.error("Delete technician error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Technicians</h1>
          <p className="welcome">
            Manage the technicians on your service team.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingTechnician(null);
          }}
        >
          {showForm ? "Cancel" : "+ Add Technician"}
        </button>
      </div>

      {showForm && (
        <div className="customer-form-card">
          <h2>Add New Technician</h2>

          <form onSubmit={handleSubmit}>
            <label>Name *</label>

            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Enter technician name"
              required
            />

            <label>Phone</label>

            <input
              type="text"
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
              placeholder="Enter phone number"
            />

            <label>Email</label>

            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              placeholder="Enter email address"
            />

            <label>Specialization</label>

            <input
              type="text"
              value={formData.specialization}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  specialization: event.target.value,
                })
              }
              placeholder="e.g. Plumbing, Electrical"
            />

            <label>Status</label>

            <select
              value={formData.status}
              onChange={(event) =>
                setFormData({ ...formData, status: event.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>

            <button type="submit" className="primary-button">
              Save Technician
            </button>
          </form>
        </div>
      )}

      {editingTechnician && (
        <div className="customer-form-card">
          <h2>Edit Technician</h2>

          <form onSubmit={handleEditSubmit}>
            <label>Name *</label>

            <input
              type="text"
              value={editingTechnician.name}
              onChange={(event) =>
                setEditingTechnician({
                  ...editingTechnician,
                  name: event.target.value,
                })
              }
              required
            />

            <label>Phone</label>

            <input
              type="text"
              value={editingTechnician.phone}
              onChange={(event) =>
                setEditingTechnician({
                  ...editingTechnician,
                  phone: event.target.value,
                })
              }
            />

            <label>Email</label>

            <input
              type="email"
              value={editingTechnician.email}
              onChange={(event) =>
                setEditingTechnician({
                  ...editingTechnician,
                  email: event.target.value,
                })
              }
            />

            <label>Specialization</label>

            <input
              type="text"
              value={editingTechnician.specialization}
              onChange={(event) =>
                setEditingTechnician({
                  ...editingTechnician,
                  specialization: event.target.value,
                })
              }
            />

            <label>Status</label>

            <select
              value={editingTechnician.status}
              onChange={(event) =>
                setEditingTechnician({
                  ...editingTechnician,
                  status: event.target.value,
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="customer-list-card">
        <div className="customer-list-header">
          <h2>Technician List</h2>
        </div>

        {loading ? (
          <p>Loading technicians...</p>
        ) : technicians.length === 0 ? (
          <p>No technicians found.</p>
        ) : (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {technicians.map((technician) => (
                  <tr key={technician.id}>
                    <td>{technician.name}</td>
                    <td>{technician.phone || "-"}</td>
                    <td>{technician.email || "-"}</td>
                    <td>{technician.specialization || "-"}</td>
                    <td>{technician.status}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => startEditing(technician)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(technician.id, technician.name)
                          }
                        >
                          Delete
                        </button>
                      </div>
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

export default Technicians;