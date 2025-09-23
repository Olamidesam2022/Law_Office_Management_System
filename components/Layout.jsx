import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

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

  return (
    <div className="d-flex">
      {/* Sidebar (desktop + mobile overlay handled inside Sidebar) */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
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
        {/* Debug label: show current search and page */}
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
            <div className="modal-dialog">
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
                  {/* Add your case form fields here */}
                  <div className="form-group mb-3">
                    <label className="form-label">Case Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter case title"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Client</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
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
                  <button type="button" className="btn btn-primary-custom">
                    Add Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
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
