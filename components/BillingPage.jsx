import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Search, Eye, Edit, Trash } from "lucide-react";
import { supabaseService } from "../supabase/services.js";

// =======================================================
// CRUD Operations in BillingPage.jsx
// =======================================================
// CREATE: handleSaveInvoice() - adds a new invoice
//   - Uses firebaseService.create("invoices", newInvoice)
// READ:   loadInvoices() - fetches all invoices
//   - Uses firebaseService.getAll("invoices")
//   - Called in useEffect on mount/user change
// UPDATE: (Edit functionality not implemented yet)
// DELETE: handleDeleteInvoice() - deletes an invoice
//   - Uses firebaseService.delete("invoices", id)
// =======================================================

export function BillingPage({ user, searchQuery = "" }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Create Invoice form state
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");

  const [errors, setErrors] = useState({});
  const [highlightedId, setHighlightedId] = useState(null);

  // View modal state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      supabaseService.userId = user.uid;
      loadInvoices();
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  // CRUD: READ - loadInvoices() fetches all invoices
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const invoicesData = await supabaseService.getAll("billing");
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!clientName.trim()) newErrors.clientName = "Client name is required";
    if (!invoiceNumber.trim())
      newErrors.invoiceNumber = "Invoice number is required";
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CRUD: CREATE or UPDATE - handleSaveInvoice() adds or updates an invoice
  const handleSaveInvoice = async () => {
    if (!validateForm()) return;

    try {
      const newInvoice = {
        amount: parseFloat(amount),
        due_date: date || null,
        status,
        notes: [clientName, invoiceNumber].filter(Boolean).join(" | ") || null,
      };

      if (isEditMode && editingInvoiceId) {
        // UPDATE
        await supabaseService.update("billing", editingInvoiceId, newInvoice);
        setInvoices((prev) => prev.map((inv) => (inv.id === editingInvoiceId ? { ...inv, ...newInvoice } : inv)));
        setHighlightedId(editingInvoiceId);
      } else {
        // CREATE
        const createdInvoice = await supabaseService.create("billing", newInvoice);
        const savedInvoice = { id: createdInvoice.id, ...newInvoice };
        setInvoices((prev) => [savedInvoice, ...prev]);
        setHighlightedId(createdInvoice.id);
      }

      setTimeout(() => setHighlightedId(null), 3000);

      setClientName("");
      setInvoiceNumber("");
      setAmount("");
      setDate("");
      setStatus("pending");
      setErrors({});
      setShowModal(false);
      setIsEditMode(false);
      setEditingInvoiceId(null);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Handle Edit button click
  const handleEditInvoice = (invoice) => {
    setClientName(invoice.clientName || "");
    setInvoiceNumber(invoice.invoiceNumber || "");
    setAmount(invoice.amount || "");
    setDate(invoice.date || "");
    setStatus(invoice.status || "pending");
    setIsEditMode(true);
    setEditingInvoiceId(invoice.id);
    setShowModal(true);
    setErrors({});
    setSelectedInvoice(null);
  };

  // CRUD: DELETE - handleDeleteInvoice() deletes an invoice
  const handleDeleteInvoice = async (id) => {
    try {
      await supabaseService.delete("billing", id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      setSelectedInvoice(null);
    } catch (error) {
      console.error("Error deleting invoice:", error);
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

  const filteredInvoices = invoices.filter((invoice) => (invoice.notes || "").toLowerCase().includes(searchTerm.toLowerCase()));

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
            <div
              key={invoice.id}
              className={`custom-card mb-3 ${
                highlightedId === invoice.id ? "highlighted-card" : ""
              }`}
            >
              <div className="custom-card-body">
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">
                    <h6 className="mb-1">{invoice.notes || "Invoice"}</h6>
                    <small className="text-muted">{invoice.status}</small>
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0">
                    <div className="fw-semibold">
                      ${invoice.amount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0">
                    <small className="text-muted">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "-"}
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
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye size={16} className="me-1" />
                      View
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <Edit size={16} className="me-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit Invoice */}
      <div
        className={`modal fade${showModal ? " show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={showModal ? { background: "rgba(0,0,0,0.5)" } : {}}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-sm"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom">
              <h5 className="modal-title">
                {isEditMode ? "Edit Invoice" : "Create Invoice"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditingInvoiceId(null);
                  setErrors({});
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  {errors.clientName && (
                    <small className="text-danger">{errors.clientName}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Invoice Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                  {errors.invoiceNumber && (
                    <small className="text-danger">
                      {errors.invoiceNumber}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {errors.amount && (
                    <small className="text-danger">{errors.amount}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {errors.date && (
                    <small className="text-danger">{errors.date}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditingInvoiceId(null);
                  setErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveInvoice}
              >
                {isEditMode ? "Update Invoice" : "Save Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Invoice */}
      {selectedInvoice && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Invoice Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedInvoice(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Notes:</strong> {selectedInvoice.notes || "-"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedInvoice.status}
                </p>
                <p>
                  <strong>Amount:</strong> $
                  {selectedInvoice.amount?.toLocaleString()}
                </p>
                <p>
                  <strong>Due Date:</strong> {selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString() : "-"}
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                >
                  <Trash size={16} className="me-1" /> Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditInvoice(selectedInvoice)}
                >
                  <Edit size={16} className="me-1" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Highlight style */}
      <style>
        {`
          .highlighted-card {
            background-color: #d1e7dd !important;
            transition: background-color 2s ease;
          }
        `}
      </style>
    </div>
  );
}
