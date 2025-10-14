import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { supabaseService } from "../supabase/services.js";

export function CasesPage({ user, searchQuery = "" }) {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    clientId: "",
    type: "",
    status: "active",
    priority: "medium",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    if (user && user.uid) {
      supabaseService.userId = user.uid;
      loadData();
    }
  }, [user]);

  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [casesData, clientsData] = await Promise.all([
        supabaseService.getAll("cases"),
        supabaseService.getAll("clients"),
      ]);
      setCases(casesData);
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCase = async () => {
    try {
      const caseData = await supabaseService.create("cases", {
        title: newCase.title,
        client_id: newCase.clientId,
        type: newCase.type || null,
        status: newCase.status || "active",
        priority: newCase.priority || "medium",
        description: newCase.description || null,
        due_date: newCase.deadline || null,
      });
      setCases([...cases, caseData]);
      setNewCase({
        title: "",
        clientId: "",
        type: "",
        status: "active",
        priority: "medium",
        description: "",
        deadline: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding case:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "closed":
        return "badge-secondary";
      default:
        return "badge-secondary";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-info";
      case "low":
        return "badge-secondary";
      default:
        return "badge-secondary";
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container-fluid px-2 px-md-4">
        <h2 className="fw-semibold text-dark mb-4">Cases</h2>
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="custom-card mb-3">
              <div className="custom-card-body text-center">
                <div
                  className="loading-spinner"
                  style={{ height: "80px" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Cases</h2>
          <p className="text-muted">Track and manage your legal cases</p>
        </div>
        <button
          className="btn btn-primary-custom mt-0"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} className="me-2" />
          Add Case
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section mb-4">
        <div className="row g-3">
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
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case List */}
      {filteredCases.length === 0 ? (
        <div className="custom-card text-center p-4">
          <Briefcase size={48} className="mb-3 text-muted" />
          <h5 className="fw-medium text-dark">No cases found</h5>
          <p className="text-muted">
            {searchTerm || statusFilter !== "all"
              ? "No cases match your search criteria."
              : "Get started by adding your first case."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              className="btn btn-primary-custom mt-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="me-2" />
              Add Your First Case
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle custom-table">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Type</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem) => {
                const client = clients.find(
                  (c) => c.id === (caseItem.client_id || caseItem.clientId)
                );
                return (
                  <tr key={caseItem.id} className="custom-row">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FileText size={16} />
                        <strong>{caseItem.title}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <User size={16} />
                        {client ? client.name : "—"}
                      </div>
                    </td>
                    <td className="text-capitalize">{caseItem.type || "—"}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={16} />
                        {caseItem.due_date
                          ? new Date(caseItem.due_date).toLocaleDateString()
                          : "—"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${getPriorityBadgeClass(
                          caseItem.priority
                        )}`}
                      >
                        {caseItem.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(
                          caseItem.status
                        )}`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Case Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content small-modal">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-semibold">Add New Case</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body modal-body-scroll">
                <div className="form-group mb-2">
                  <label className="form-label small">Case Title *</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) =>
                      setNewCase({ ...newCase, title: e.target.value })
                    }
                    placeholder="Enter case title"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label small">Client *</label>
                  <select
                    value={newCase.clientId}
                    onChange={(e) =>
                      setNewCase({ ...newCase, clientId: e.target.value })
                    }
                    className="form-select form-select-sm"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label small">Case Type</label>
                  <input
                    type="text"
                    value={newCase.type}
                    onChange={(e) =>
                      setNewCase({ ...newCase, type: e.target.value })
                    }
                    placeholder="e.g., Civil, Criminal, Corporate"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label small">Priority</label>
                  <select
                    value={newCase.priority}
                    onChange={(e) =>
                      setNewCase({ ...newCase, priority: e.target.value })
                    }
                    className="form-select form-select-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label small">Deadline</label>
                  <input
                    type="date"
                    value={newCase.deadline}
                    onChange={(e) =>
                      setNewCase({ ...newCase, deadline: e.target.value })
                    }
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label small">Description</label>
                  <input
                    type="text"
                    value={newCase.description}
                    onChange={(e) =>
                      setNewCase({ ...newCase, description: e.target.value })
                    }
                    placeholder="Brief case description"
                    className="form-control form-control-sm"
                  />
                </div>
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom btn-sm"
                  onClick={handleAddCase}
                  disabled={!newCase.title || !newCase.clientId}
                >
                  Add Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-table {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          }
          .custom-row:hover {
            background-color: #f9fafb;
            transition: 0.2s;
          }
          .badge {
            padding: 0.4rem 0.6rem;
            border-radius: 12px;
            font-size: 0.75rem;
          }
          .badge-success { background-color: #d1fae5; color: #065f46; }
          .badge-warning { background-color: #fef3c7; color: #92400e; }
          .badge-danger { background-color: #fee2e2; color: #991b1b; }
          .badge-info { background-color: #e0f2fe; color: #075985; }
          .badge-secondary { background-color: #e5e7eb; color: #374151; }

          .btn-primary-custom {
            background-color: #2563eb;
            color: #fff;
            border: 1px solid rgba(15, 23, 42, 0.06);
            box-shadow: none;
          }

          /* ✅ Smaller, screen-contained modal */
          .small-modal {
            border-radius: 12px;
            max-height: 85vh;
            overflow: hidden;
          }
          .modal-body-scroll {
            max-height: 60vh;
            overflow-y: auto;
            padding-right: 6px;
          }
          .modal-body-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .modal-body-scroll::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
}
