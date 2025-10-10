import React, { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash } from "lucide-react";
import { supabaseService } from "../supabase/services.js";

// =======================================================
// CRUD Operations in DocumentsPage.jsx
// =======================================================
// READ:   loadDocuments() - fetches all documents
// CREATE: handleUpload()
// UPDATE: (Not implemented)
// DELETE: handleDelete()
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

  useEffect(() => {
    setSearchTerm(searchQuery || "");
  }, [searchQuery]);

  // READ
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

  // CREATE
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

  // DOWNLOAD
  const handleDownload = async (doc) => {
    try {
      if (!doc?.path) return;
      const prefix = `${supabaseService.userId}/`;
      const fileKey = doc.path.startsWith(prefix)
        ? doc.path.slice(prefix.length)
        : doc.path;
      const url = await supabaseService.getFileUrl("documents", fileKey);
      if (url) window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  // DELETE
  const handleDelete = async (doc) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    try {
      const prefix = `${supabaseService.userId}/`;
      const fileKey = doc.path.startsWith(prefix)
        ? doc.path.slice(prefix.length)
        : doc.path;
      await supabaseService.deleteFile("documents", fileKey);
      await supabaseService.delete("documents", doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
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

      {/* Documents list - modern table view */}
      <div className="mb-4">
        {filteredDocuments.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="fw-semibold">
                      <FileText size={18} className="me-2 text-primary" />
                      {doc.name}
                    </td>
                    <td>{doc.type || <span className="text-muted">—</span>}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download
                            size={16}
                            className="me-1 d-none d-sm-inline"
                          />
                          <span className="d-none d-sm-inline">Download</span>
                          <Download size={16} className="d-inline d-sm-none" />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center"
                          onClick={() => handleDelete(doc)}
                        >
                          <Trash
                            size={16}
                            className="me-1 d-none d-sm-inline"
                          />
                          <span className="d-none d-sm-inline">Delete</span>
                          <Trash size={16} className="d-inline d-sm-none" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Styles */}
      <style>
        {`
          .table {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .btn-sm {
            font-size: 0.85rem;
          }
          @media (max-width: 576px) {
            .table th, .table td {
              font-size: 0.9rem;
            }
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
