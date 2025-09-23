import React, { useState } from "react";
import { Menu, Search } from "lucide-react";

export function TopNavbar({ onToggleSidebar, user, onLogout, globalSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // Get initials from email
  let initials = "";
  let displayName = "";
  if (user && user.email) {
    displayName = user.email;
    const namePart = user.email.split("@")[0];
    initials = namePart
      .split(/[._-]/)
      .map((n) => n[0]?.toUpperCase() || "")
      .join("");
    if (!initials) initials = user.email[0]?.toUpperCase() || "U";
  }

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    if (globalSearch) {
      const data = await globalSearch(value); // 🔎 ask parent for results
      setResults(data || []);
    }
  };

  return (
    <div
      className="top-navbar d-flex align-items-center justify-content-between px-3"
      style={{
        minHeight: "48px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1040,
        marginLeft: "250px",
        paddingTop: "0.25rem",
        paddingBottom: "0.25rem",
      }}
    >
      {/* Left: Hamburger + Search */}
      <div className="d-flex align-items-center position-relative">
        {/* Hamburger (mobile only) */}
        <button
          className="btn d-md-none me-2"
          style={{ border: "none", background: "transparent", padding: "4px" }}
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>

        {/* 🔎 Global Search */}
        <div className="position-relative ms-2">
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
            }}
          />
          <input
            type="text"
            className="form-control"
            style={{
              borderRadius: "9999px",
              paddingLeft: "30px",
              height: "32px",
              fontSize: "13px",
              width: "260px",
            }}
            placeholder="Search cases, invoices, appointments..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {/* 🔽 Dropdown Results */}
          {results.length > 0 && (
            <div
              className="dropdown-menu show mt-1"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {results.map((item, i) => (
                <button
                  key={i}
                  className="dropdown-item text-truncate"
                  onClick={() => {
                    if (item.onNavigate) item.onNavigate(); // navigate
                    setResults([]);
                    setSearchTerm("");
                  }}
                >
                  <strong>{item.type}:</strong> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: User Info + Logout */}
      <div className="d-flex align-items-center">
        <div className="text-end me-2 d-none d-sm-block">
          <div className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
            {displayName || "User"}
          </div>
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "600",
            fontSize: "13px",
          }}
        >
          {initials || "U"}
        </div>
        <button
          className="btn btn-outline-danger ms-2"
          style={{
            fontWeight: 600,
            borderRadius: "9999px",
            fontSize: "0.95rem",
            padding: "4px 14px",
            height: "32px",
            lineHeight: "1.1",
          }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
