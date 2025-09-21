import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Search, Eye } from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function BillingPage({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      firebaseService.setUserId(user.uid);
      loadInvoices();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const invoicesData = await firebaseService.getAll("invoices");
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "overdue":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-dark">Billing & Invoices</h2>
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Billing & Invoices</h2>
          <p className="text-muted">Manage invoices and track payments</p>
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#212529",
            fontSize: "1rem",
            fontFamily: "inherit",
            padding: "10px 16px",
            borderRadius: "8px",
            letterSpacing: "0.01em",
          }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} style={{ marginRight: "8px" }} />
          Create Invoice
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
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="empty-state">
              <DollarSign className="empty-state-icon" size={64} />
              <h5 className="fw-medium text-dark mb-2">No invoices found</h5>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "No invoices match your search criteria."
                  : "Create your first invoice to get started."}
              </p>
              {!searchTerm && (
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#212529",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    letterSpacing: "0.01em",
                  }}
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={16} style={{ marginRight: "8px" }} />
                  Create Your First Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="custom-card mb-3">
              <div className="custom-card-body">
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">
                    <h6 className="mb-1">{invoice.invoiceNumber}</h6>
                    <small className="text-muted">{invoice.clientName}</small>
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0">
                    <div className="fw-semibold">
                      ${invoice.amount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0">
                    <small className="text-muted">
                      {new Date(invoice.date).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0">
                    <span
                      className={`badge ${getStatusBadgeClass(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="col-12 col-md-3 mt-2 mt-md-0 text-md-end">
                    <button className="btn btn-outline-primary btn-sm">
                      <Eye size={16} className="me-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Creating Invoice */}
      <div
        className={`modal fade${showModal ? " show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={showModal ? { background: "rgba(0,0,0,0.5)" } : {}}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Invoice</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {/* Invoice creation form goes here */}
              <form>
                <div className="mb-3">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Invoice Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter invoice number"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select">
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
