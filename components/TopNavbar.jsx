import React, { useEffect, useState } from "react";

export function TopNavbar({ user, onLogout }) {
  const [dateTime, setDateTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get display name and initials
  let displayName = "";
  let initials = "";

  if (user) {
    if (user.name && user.name.trim()) {
      displayName = user.name;
      initials = user.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0]?.toUpperCase() || "")
        .join("");
    } else if (user.email) {
      const namePart = user.email.split("@")[0];
      displayName = namePart;
      initials = namePart
        .split(/[._-]/)
        .map((n) => n[0]?.toUpperCase() || "")
        .join("");
    }
  }

  if (!displayName) {
    displayName = "User";
    initials = "U";
  }

  return (
    <div
      className="top-navbar d-flex align-items-center justify-content-between px-3"
      style={{
        minHeight: "52px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1040,
        marginLeft: "250px",
        paddingTop: "0.35rem",
        paddingBottom: "0.35rem",
      }}
    >
      {/* Left: Live Date & Time */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#4b5563",
          letterSpacing: "0.02em",
        }}
      >
        {dateTime.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        | {dateTime.toLocaleTimeString()}
      </div>

      {/* Right: Hello + User + Logout */}
      <div className="d-flex align-items-center fade-in-user">
        <div className="text-end me-2">
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#2563eb",
              letterSpacing: "0.03em",
            }}
          >
            Hello,{" "}
            <span style={{ textTransform: "capitalize" }}>{displayName}</span>{" "}
            👋
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
            marginLeft: "8px",
          }}
        >
          {initials}
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

      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeSlideUp {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .fade-in-user {
            animation: fadeSlideUp 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
