import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
} from "lucide-react";
import { supabaseService } from "../supabase/services.js";

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
  }, [user]);

  // Sync top navbar search
  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  // READ
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

  // CREATE
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
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Clients</h2>
          <p className="text-muted">Manage your client relationships</p>
        </div>
        <button
          className="btn btn-primary-custom mt-0"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} className="me-2" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients list - Table layout */}
      <div className="mb-4">
        {filteredClients.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="fw-semibold">
                      <Users size={18} className="me-2 text-primary" />
                      {client.name}
                    </td>
                    <td>
                      {client.email ? (
                        <span className="text-muted">
                          <Mail size={14} className="me-1" />
                          {client.email}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {client.phone ? (
                        <span className="text-muted">
                          <Phone size={14} className="me-1" />
                          {client.phone}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {client.company ? (
                        <span className="text-muted">
                          <Building size={14} className="me-1" />
                          {client.company}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {client.address ? (
                        <span className="text-muted">
                          <MapPin size={14} className="me-1" />
                          {client.address}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="col-12 text-center text-muted py-5">
            No clients found
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-sm modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Client</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowAddModal(false)}
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newClient.name}
                      onChange={(e) =>
                        setNewClient({ ...newClient, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newClient.phone}
                      onChange={(e) =>
                        setNewClient({ ...newClient, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newClient.company}
                      onChange={(e) =>
                        setNewClient({ ...newClient, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newClient.address}
                      onChange={(e) =>
                        setNewClient({ ...newClient, address: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={btnStyle}
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

      {/* Table Styling */}
      <style>
        {`
          .table {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .table th, .table td {
            vertical-align: middle;
          }
          @media (max-width: 576px) {
            .table th, .table td {
              font-size: 0.9rem;
            }
            .btn {
              width: 100%;
            }
          }
          .btn-primary-custom {
            background-color: #2563eb;
            color: #fff;
            border: 1px solid rgba(15, 23, 42, 0.06);
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
}

const btnStyle = {
  background: "transparent",
  border: "1px solid #ccc",
  color: "#212529",
  fontSize: "1rem",
  fontFamily: "inherit",
  padding: "10px 16px",
  borderRadius: "8px",
  letterSpacing: "0.01em",
  cursor: "pointer",
};
