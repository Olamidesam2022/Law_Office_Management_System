import React from "react";
import { Bell, Search, Settings, Menu } from "lucide-react";

export function TopNavbar({ onToggleSidebar, user, onLogout }) {
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

  return (
    <div
      className="top-navbar d-flex align-items-center justify-content-between px-4"
      style={{
        minHeight: "70px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        marginLeft: "250px", // ✅ push navbar right of sidebar on desktop
      }}
    >
      {/* Left section */}
      <div className="d-flex align-items-center">
        {/* Hamburger (mobile only) */}
        <button
          className="btn d-md-none me-3"
          style={{ border: "none", background: "transparent" }}
          onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Search Bar (hidden on mobile) */}
        <div
          className="navbar-search flex-grow-1 me-4 d-none d-md-block"
          style={{ maxWidth: "400px" }}
        >
          <div className="position-relative">
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "18px",
                height: "18px",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search clients, cases, documents..."
              className="form-control"
              style={{
                paddingLeft: "2.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "9999px",
                fontSize: "14px",
                height: "40px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="d-flex align-items-center">
        <div className="text-end me-3 d-none d-sm-block">
          <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
            {displayName || "User"}
          </div>
        </div>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {initials || "U"}
        </div>
        <button
          className="btn btn-outline-danger ms-3"
          style={{ fontWeight: 600, borderRadius: "9999px" }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
