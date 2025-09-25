import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { firebaseService } from "../firebase/services.js";

export function Layout({
  children,
  currentPage,
  onPageChange,
  user,
  onLogout,
  searchQuery,
  onSearch,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);

  // form state
  const [caseTitle, setCaseTitle] = useState("");
  const [client, setClient] = useState("");
  const [caseType, setCaseType] = useState("");

  // Save case to Firestore
  const handleAddCase = async () => {
    if (!caseTitle.trim()) {
      alert("Case title is required!");
      return;
    }
    try {
      await firebaseService.add("cases", {
        title: caseTitle,
        client,
        type: caseType,
        createdAt: new Date().toISOString(),
      });
      alert("Case added successfully!");
      // reset form + close modal
      setCaseTitle("");
      setClient("");
      setCaseType("");
      setShowAddCaseModal(false);
    } catch (err) {
      console.error("Error adding case:", err);
      alert("Failed to add case. Please try again.");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar (fixed) */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: "250px", // always push content right
        }}
      >
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={typeof user === "object" ? user : { email: user }}
          onLogout={onLogout}
          searchQuery={searchQuery}
          onSearch={onSearch}
          onSearchSubmit={onSearch}
          onAddCase={() => setShowAddCaseModal(true)}
        />

        {/* Debug info */}
        <div
          style={{
            background: "#f3f4f6",
            padding: "4px 12px",
            fontSize: "13px",
            color: "#333",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <strong>Debug:</strong> searchQuery = "{searchQuery}", currentPage = "
          {currentPage}"
        </div>

        {/* Add Case Modal */}
        {showAddCaseModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Case</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddCaseModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="form-label">Case Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                      placeholder="Enter case title"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Client</label>
                    <input
                      type="text"
                      className="form-control"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      placeholder="e.g., Civil, Criminal, Corporate"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddCaseModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary-custom"
                    onClick={handleAddCase}
                  >
                    Add Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="p-4"
          style={{
            marginTop: "70px", // push below navbar
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
