import { useEffect, useState } from "react";
import ServiceRequests from "./ServiceRequests";
import ServiceRequests from "./ServiceRequests";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState("dashboard");
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [editingCustomer, setEditingCustomer] = useState(null);

  async function loadCustomers(search = "") {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoadingCustomers(true);

    try {
      const response = await fetch(
        `${API_URL}/api/customers?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setCustomers(data.customers);
    } catch (error) {
      console.error("Customer loading error:", error);
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the ServiTrack server.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCustomers([]);
    setEmail("");
    setPassword("");
    setActivePage("dashboard");
  }

  async function handleAddCustomer(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to add customer.");
        return;
      }

      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });

      setShowAddForm(false);

      await loadCustomers(customerSearch);

      alert("Customer added successfully.");
    } catch (error) {
      console.error("Add customer error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  function startEditing(customer) {
    setEditingCustomer({
      customer_id: customer.customer_id,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      notes: customer.notes || "",
    });

    setShowAddForm(false);
  }

  function cancelEditing() {
    setEditingCustomer(null);
  }

  async function handleEditCustomer(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/customers/${editingCustomer.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingCustomer.name,
            phone: editingCustomer.phone,
            email: editingCustomer.email,
            address: editingCustomer.address,
            notes: editingCustomer.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update customer.");
        return;
      }

      setEditingCustomer(null);

      await loadCustomers(customerSearch);

      alert("Customer updated successfully.");
    } catch (error) {
      console.error("Update customer error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  async function handleDeleteCustomer(customerId, customerName) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customerName}?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete customer.");
        return;
      }

      await loadCustomers(customerSearch);

      alert("Customer deleted successfully.");
    } catch (error) {
      console.error("Delete customer error:", error);
      alert("Unable to connect to the ServiTrack server.");
    }
  }

  useEffect(() => {
    if (user) {
      loadCustomers();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="app">
        <header className="navbar">
          <div className="logo">ServiTrack</div>
        </header>

        <main className="hero">
          <div className="hero-content">
            <h1>Service Business Management Made Simple</h1>

            <p>
              Manage customers, service requests, jobs, technicians, and
              schedules in one place.
            </p>
          </div>

          <div className="login-card">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
              />

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />

              <button type="submit" className="primary-button">
                Login
              </button>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">ServiTrack</div>

        <div className="user-area">
          <span>
            {user.full_name} ({user.role})
          </span>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Menu</h3>

          <button
            className={activePage === "dashboard" ? "active-menu" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "customers" ? "active-menu" : ""}
            onClick={() => {
              setActivePage("customers");
              loadCustomers();
            }}
          >
            Customers
          </button>

          <button className={activePage === "serviceRequests" ? "active-menu" : ""} onClick={() => setActivePage("serviceRequests")}>Service Requests</button>
          <button>Jobs</button>
          <button>Technicians</button>
        </aside>

        <main className="dashboard-content">
          {activePage === "serviceRequests" && <ServiceRequests />}
          {activePage === "dashboard" && (
            <>
              <h1>Dashboard</h1>

              <p className="welcome">
                Welcome back, {user.full_name}!
              </p>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Customers</h3>
                  <strong>{customers.length}</strong>
                </div>

                <div className="stat-card">
                  <h3>New Requests</h3>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <h3>Scheduled Jobs</h3>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <h3>Completed Jobs</h3>
                  <strong>0</strong>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Upcoming Appointments</h2>
                <p>No upcoming appointments.</p>
              </div>
            </>
          )}

          {activePage === "customers" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Customers</h1>
                  <p className="welcome">
                    Manage your service business customers.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingCustomer(null);
                  }}
                >
                  {showAddForm ? "Cancel" : "+ Add Customer"}
                </button>
              </div>

              {showAddForm && (
                <div className="customer-form-card">
                  <h2>Add New Customer</h2>

                  <form onSubmit={handleAddCustomer}>
                    <label>Customer Name *</label>

                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(event) =>
                        setNewCustomer({
                          ...newCustomer,
                          name: event.target.value,
                        })
                      }
                      placeholder="Enter customer name"
                      required
                    />

                    <label>Phone</label>

                    <input
                      type="text"
                      value={newCustomer.phone}
                      onChange={(event) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: event.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                    />

                    <label>Email</label>

                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(event) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: event.target.value,
                        })
                      }
                      placeholder="Enter email address"
                    />

                    <label>Address</label>

                    <input
                      type="text"
                      value={newCustomer.address}
                      onChange={(event) =>
                        setNewCustomer({
                          ...newCustomer,
                          address: event.target.value,
                        })
                      }
                      placeholder="Enter address"
                    />

                    <label>Notes</label>

                    <textarea
                      value={newCustomer.notes}
                      onChange={(event) =>
                        setNewCustomer({
                          ...newCustomer,
                          notes: event.target.value,
                        })
                      }
                      placeholder="Additional notes"
                      rows="4"
                    />

                    <button type="submit" className="primary-button">
                      Save Customer
                    </button>
                  </form>
                </div>
              )}

              {editingCustomer && (
                <div className="customer-form-card">
                  <h2>Edit Customer</h2>

                  <form onSubmit={handleEditCustomer}>
                    <label>Customer Name *</label>

                    <input
                      type="text"
                      value={editingCustomer.name}
                      onChange={(event) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          name: event.target.value,
                        })
                      }
                      required
                    />

                    <label>Phone</label>

                    <input
                      type="text"
                      value={editingCustomer.phone}
                      onChange={(event) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          phone: event.target.value,
                        })
                      }
                    />

                    <label>Email</label>

                    <input
                      type="email"
                      value={editingCustomer.email}
                      onChange={(event) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          email: event.target.value,
                        })
                      }
                    />

                    <label>Address</label>

                    <input
                      type="text"
                      value={editingCustomer.address}
                      onChange={(event) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          address: event.target.value,
                        })
                      }
                    />

                    <label>Notes</label>

                    <textarea
                      value={editingCustomer.notes}
                      onChange={(event) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          notes: event.target.value,
                        })
                      }
                      rows="4"
                    />

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
                  <h2>Customer List</h2>

                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCustomerSearch(value);
                      loadCustomers(value);
                    }}
                    placeholder="Search customers..."
                  />
                </div>

                {loadingCustomers ? (
                  <p>Loading customers...</p>
                ) : customers.length === 0 ? (
                  <p>No customers found.</p>
                ) : (
                  <div className="customer-table-wrapper">
                    <table className="customer-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.customer_id}>
                            <td>{customer.name}</td>
                            <td>{customer.phone || "-"}</td>
                            <td>{customer.email || "-"}</td>
                            <td>{customer.address || "-"}</td>

                            <td>
                              <div className="action-buttons">
                                <button
                                  className="edit-button"
                                  onClick={() => startEditing(customer)}
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    handleDeleteCustomer(
                                      customer.customer_id,
                                      customer.name
                                    )
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
