import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Mail, Phone } from "lucide-react";
import { supabaseService } from "../supabase/services.js";

// =======================================================
// CRUD Operations in ClientsPage.jsx
// =======================================================
// CREATE: handleAddClient() - adds a new client
//   - Uses supabaseService.create("clients", newClient)
// READ:   loadClients() - fetches all clients
//   - Uses supabaseService.getAll("clients")
//   - Called in useEffect on mount/user change
// UPDATE: (Not implemented in this file)
// DELETE: (Not implemented in this file)
// =======================================================

export function ClientsPage({ user, searchQuery = "" }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  useEffect(() => {
    if (user && user.uid) {
      supabaseService.userId = user.uid;
      loadClients();
    }
    // eslint-disable-next-line
  }, [user]);

  // Sync top navbar search into local search input
  useEffect(() => {
    try {
      console.debug("ClientsPage sync searchQuery ->", searchQuery);
    } catch (err) {}
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  // CRUD: READ - loadClients() fetches all clients
  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await supabaseService.getAll("clients");
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD: CREATE - handleAddClient() adds a new client
  const handleAddClient = async () => {
    try {
      const client = await supabaseService.create("clients", {
        ...newClient,
      });
      setClients([...clients, client]);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        address: "",
        company: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container-fluid px-2 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h2 className="fw-semibold text-dark">Clients</h2>
        </div>
        <div className="row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="custom-card">
                <div className="custom-card-body">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "80px" }}
                  >
                    <div className="loading-spinner"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Clients</h2>
          <p className="text-muted">Manage your client relationships</p>
        </div>
        <button
          className="btn btn-primary-custom mt-2 mt-md-0 w-100 w-md-auto"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} className="me-2" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="filter-section mb-4">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <Search
                className="position-absolute"
                style={{
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "#6b7280",
                }}
              />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="empty-state">
              <Users className="empty-state-icon" size={64} />
              <h5 className="fw-medium text-dark mb-2">No clients found</h5>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "No clients match your search criteria."
                  : "Get started by adding your first client."}
              </p>
              {!searchTerm && (
                <button
                  className="btn btn-primary-custom"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} className="me-2" />
                  Add Your First Client
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredClients.map((client) => (
            <div key={client.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="custom-card" style={{ minWidth: "260px" }}>
                <div className="custom-card-header">
                  <h5 className="mb-0">{client.name}</h5>
                  {client.company && (
                    <small className="text-muted">{client.company}</small>
                  )}
                </div>
                <div className="custom-card-body">
                  <div className="mb-2">
                    {client.email && (
                      <div
                        className="d-flex align-items-center text-muted mb-2"
                        style={{ fontSize: "14px" }}
                      >
                        <Mail size={16} className="me-2" />
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div
                        className="d-flex align-items-center text-muted mb-2"
                        style={{ fontSize: "14px" }}
                      >
                        <Phone size={16} className="me-2" />
                        {client.phone}
                      </div>
                    )}
                    {client.address && (
                      <p
                        className="text-muted mt-2 mb-0"
                        style={{ fontSize: "14px" }}
                      >
                        {client.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Client</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    placeholder="Enter client name"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) =>
                      setNewClient({ ...newClient, company: e.target.value })
                    }
                    placeholder="Enter company name"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: e.target.value })
                    }
                    placeholder="Enter address"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom"
                  onClick={handleAddClient}
                  disabled={!newClient.name}
                >
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 576px) {
            .custom-card {
              padding: 0.5rem;
            }
            .btn-primary-custom {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}
