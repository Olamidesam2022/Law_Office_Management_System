import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Download, Upload } from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function DocumentsPage({ user, searchQuery = "" }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      firebaseService.setUserId(user.uid);
      loadDocuments();
    }
    // eslint-disable-next-line
  }, [user]);

  // Sync top navbar search into local search input
  useEffect(() => {
    try {
      console.debug("DocumentsPage sync searchQuery ->", searchQuery);
    } catch (err) {}
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const documentsData = await firebaseService.getAll("documents");
      setDocuments(documentsData);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-dark">Documents</h2>
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
          <h2 className="fw-semibold text-dark">Documents</h2>
          <p className="text-muted">Manage case documents and files</p>
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
          <Upload size={16} style={{ marginRight: "8px" }} />
          Upload Document
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Document list */}
      <div className="row">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="custom-card">
              <div className="custom-card-header">
                <h5 className="mb-0 d-flex align-items-center">
                  <FileText size={20} className="me-2" />
                  {doc.name}
                </h5>
              </div>
              <div className="custom-card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{doc.type}</small>
                  <button className="btn btn-outline-primary btn-sm">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for uploading document */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Document Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter document name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter document type"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">File</label>
                    <input type="file" className="form-control" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
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
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
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
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
