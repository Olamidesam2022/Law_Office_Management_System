import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Search, Calendar, User } from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function CasesPage({ user }) {
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
      firebaseService.setUserId(user.uid);
      loadData();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [casesData, clientsData] = await Promise.all([
        firebaseService.getAll("cases"),
        firebaseService.getAll("clients"),
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
      const caseData = await firebaseService.create("cases", {
        ...newCase,
        userId: user.uid,
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
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-dark">Cases</h2>
        </div>
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="custom-card mb-3">
              <div className="custom-card-body">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "96px" }}
                >
                  <div className="loading-spinner"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Cases</h2>
          <p className="text-muted">Track and manage your legal cases</p>
        </div>
        <button
          className="btn btn-primary-custom"
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

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="empty-state">
              <Briefcase className="empty-state-icon" size={64} />
              <h5 className="fw-medium text-dark mb-2">No cases found</h5>
              <p className="text-muted mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No cases match your search criteria."
                  : "Get started by adding your first case."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  className="btn btn-primary-custom"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} className="me-2" />
                  Add Your First Case
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {filteredCases.map((caseItem) => {
            const client = clients.find((c) => c.id === caseItem.clientId);
            return (
              <div key={caseItem.id} className="custom-card mb-3">
                <div className="custom-card-header">
                  <div className="row align-items-start">
                    <div className="col-12 col-lg-8">
                      <h5 className="mb-2">{caseItem.title}</h5>
                      <div
                        className="d-flex flex-wrap gap-3 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        {client && (
                          <div className="d-flex align-items-center">
                            <User size={16} className="me-1" />
                            {client.name}
                          </div>
                        )}
                        {caseItem.type && (
                          <span className="text-capitalize">
                            {caseItem.type}
                          </span>
                        )}
                        {caseItem.deadline && (
                          <div className="d-flex align-items-center">
                            <Calendar size={16} className="me-1" />
                            {new Date(caseItem.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                      <div className="d-flex gap-2 justify-content-lg-end">
                        <span
                          className={`badge ${getPriorityBadgeClass(
                            caseItem.priority
                          )}`}
                        >
                          {caseItem.priority}
                        </span>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            caseItem.status
                          )}`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {caseItem.description && (
                  <div className="custom-card-body">
                    <p className="text-muted mb-0">{caseItem.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Case Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Case</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Case Title *</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) =>
                      setNewCase({ ...newCase, title: e.target.value })
                    }
                    placeholder="Enter case title"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Client *</label>
                  <select
                    value={newCase.clientId}
                    onChange={(e) =>
                      setNewCase({ ...newCase, clientId: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Case Type</label>
                  <input
                    type="text"
                    value={newCase.type}
                    onChange={(e) =>
                      setNewCase({ ...newCase, type: e.target.value })
                    }
                    placeholder="e.g., Civil, Criminal, Corporate"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    value={newCase.priority}
                    onChange={(e) =>
                      setNewCase({ ...newCase, priority: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    value={newCase.deadline}
                    onChange={(e) =>
                      setNewCase({ ...newCase, deadline: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={newCase.description}
                    onChange={(e) =>
                      setNewCase({ ...newCase, description: e.target.value })
                    }
                    placeholder="Brief case description"
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
    </div>
  );
}
