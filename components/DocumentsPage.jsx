import React, { useState, useEffect } from "react";
import { FileText, Upload, Download } from "lucide-react";
import { supabaseService } from "../supabase/services.js";

// =======================================================
// CRUD Operations in DocumentsPage.jsx
// =======================================================
// READ:   loadDocuments() - fetches all documents
//   - Uses supabaseService.getAll("documents")
//   - Called in useEffect on mount/user change
// CREATE: (Upload Modal UI present, but actual upload logic not implemented)
// UPDATE: (Not implemented in this file)
// DELETE: (Not implemented in this file)
// =======================================================

export function DocumentsPage({ user, searchQuery = "" }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      supabaseService.userId = user.uid;
      loadDocuments();
    }
  }, [user]);

  // Keep top navbar search synced
  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  // CRUD: READ - loadDocuments() fetches all documents
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await supabaseService.getAll("documents");
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      if (!docName || !docFile) return;
      const safeName = docFile.name || "file";
      const key = `${Date.now()}_${safeName}`;
      await supabaseService.uploadFile("documents", key, docFile);
      const created = await supabaseService.create("documents", {
        name: docName,
        type: docType || null,
        path: `${supabaseService.userId}/${key}`,
      });
      setDocuments((prev) => [created, ...prev]);
      setDocName("");
      setDocType("");
      setDocFile(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (!doc?.path) return;
      const prefix = `${supabaseService.userId}/`;
      const fileKey = doc.path.startsWith(prefix)
        ? doc.path.slice(prefix.length)
        : doc.path;
      const url = await supabaseService.getFileUrl("documents", fileKey);
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container-fluid px-2 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
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
    <div className="container-fluid px-2 px-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Documents</h2>
          <p className="text-muted">Manage case documents and files</p>
        </div>
        <button
          className="mt-2 mt-md-0"
          style={btnStyle}
          onClick={() => setShowModal(true)}
        >
          <Upload size={16} className="me-2" />
          Upload Document
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Documents list */}
      <div className="row">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="custom-card" style={{ minWidth: "260px" }}>
                <div className="custom-card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2" />
                    {doc.name}
                  </h5>
                </div>
                <div className="custom-card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{doc.type}</small>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted py-5">
            No documents found
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
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
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">File</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={btnStyle}
                  onClick={handleUpload}
                  disabled={!docName || !docFile}
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive tweaks */}
      <style>
        {`
          @media (max-width: 576px) {
            .custom-card { padding: 0.5rem; }
            .btn-outline-primary { width: 100%; }
          }
        `}
      </style>
    </div>
  );
}

/* Shared button style */
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
