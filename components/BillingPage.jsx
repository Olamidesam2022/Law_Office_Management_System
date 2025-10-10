import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Eye,
  Edit,
  Trash,
  Calendar,
  User,
  Hash,
  Tag,
  Mail,
  Building,
  MapPin,
} from "lucide-react";
import { supabaseService } from "../supabase/services.js";

export function BillingPage({ user, searchQuery = "" }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");

  const [errors, setErrors] = useState({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      supabaseService.userId = user.uid;
      loadInvoices();
    }
  }, [user]);

  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

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
        await supabaseService.update("billing", editingInvoiceId, newInvoice);
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === editingInvoiceId ? { ...inv, ...newInvoice } : inv
          )
        );
        setHighlightedId(editingInvoiceId);
      } else {
        const createdInvoice = await supabaseService.create(
          "billing",
          newInvoice
        );
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

  const handleEditInvoice = (invoice) => {
    const [name, number] = (invoice.notes || "").split(" | ");
    setClientName(name || "");
    setInvoiceNumber(number || "");
    setAmount(invoice.amount || "");
    setDate(invoice.due_date || "");
    setStatus(invoice.status || "pending");
    setIsEditMode(true);
    setEditingInvoiceId(invoice.id);
    setShowModal(true);
    setErrors({});
    setSelectedInvoice(null);
  };

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
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "overdue":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    (invoice.notes || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Billing & Invoices</h2>
          <p className="text-muted">Manage invoices and track payments</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} className="me-2" />
          Create Invoice
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
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
            className="form-control ps-5"
          />
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center p-5 border rounded bg-light">
          <DollarSign size={48} className="text-secondary mb-3" />
          <h5 className="fw-semibold">No invoices found</h5>
          <p className="text-muted">
            {searchTerm
              ? "No invoices match your search."
              : "Create your first invoice to get started."}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle table-hover border rounded shadow-sm">
            <thead className="bg-light fw-semibold">
              <tr>
                <th>
                  <User size={14} className="me-1" />
                  Client
                </th>
                <th>
                  <Hash size={14} className="me-1" />
                  Invoice #
                </th>
                <th>
                  <DollarSign size={14} className="me-1" />
                  Amount
                </th>
                <th>
                  <Calendar size={14} className="me-1" />
                  Due Date
                </th>
                <th>
                  <Tag size={14} className="me-1" />
                  Status
                </th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`${
                    highlightedId === invoice.id ? "table-success" : ""
                  }`}
                >
                  <td className="fw-semibold">
                    {(invoice.notes || "").split(" | ")[0] || "Unnamed Client"}
                  </td>
                  <td>{(invoice.notes || "").split(" | ")[1] || "N/A"}</td>
                  <td>${invoice.amount?.toLocaleString() || "0.00"}</td>
                  <td>
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Invoice" : "Create Invoice"}
                </h5>
                <button
                  className="btn-close"
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
                    <label className="form-label">Due Date</label>
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
                <button className="btn btn-primary" onClick={handleSaveInvoice}>
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedInvoice && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Invoice Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedInvoice(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Client:</strong>{" "}
                  {(selectedInvoice.notes || "").split(" | ")[0] || "-"}
                </p>
                <p>
                  <strong>Invoice #:</strong>{" "}
                  {(selectedInvoice.notes || "").split(" | ")[1] || "-"}
                </p>
                <p>
                  <strong>Amount:</strong> $
                  {selectedInvoice.amount?.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedInvoice.status}
                </p>
                <p>
                  <strong>Due:</strong>{" "}
                  {selectedInvoice.due_date
                    ? new Date(selectedInvoice.due_date).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                >
                  <Trash size={16} className="me-1" /> Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
                <button
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
    </div>
  );
}
