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
