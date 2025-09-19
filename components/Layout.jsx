import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function Layout({
  children,
  currentPage,
  onPageChange,
  user,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex">
      {/* Sidebar (desktop) */}
      <div
        className={`sidebar-container d-none d-md-block`}
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => {
            onPageChange(page);
          }}
        />
      </div>

      {/* Sidebar (mobile overlay) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-md-none"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              width: "250px",
              background: "#0f172a",
              color: "white",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              paddingTop: "70px", // below navbar
            }}
          >
            <Sidebar
              currentPage={currentPage}
              onPageChange={(page) => {
                onPageChange(page);
                setSidebarOpen(false); // close after click
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={typeof user === "object" ? user : { email: user }}
          onLogout={onLogout}
        />

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
