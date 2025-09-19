import React from "react";
import {
  LayoutGrid,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";

export function Sidebar({ currentPage, onPageChange, sidebarOpen, onClose }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "clients", label: "Clients", icon: Users },
    { id: "cases", label: "Cases", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div
      className={`sidebar d-flex flex-column`}
      style={{
        minHeight: "100vh",
        width: "250px",
        backgroundColor: "#0f172a",
        color: "#fff",
        padding: "1rem 0",
        paddingTop: "4.5rem", // space under Topbar
        position: "fixed",
        top: 0,
        left: "0",
        transition: "transform 0.3s ease",
        zIndex: 1050,
        transform:
          sidebarOpen || window.innerWidth >= 992
            ? "translateX(0)"
            : "translateX(-100%)",
      }}
    >
      <nav className="flex-grow-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                if (onClose) onClose();
              }}
              className="d-flex align-items-center w-100 text-start mb-2 px-4 py-2"
              style={{
                backgroundColor: isActive ? "#2563eb" : "transparent",
                color: isActive ? "#fff" : "#e2e8f0",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.2s ease",
              }}
            >
              <Icon
                size={20}
                className="me-3"
                color={isActive ? "#fff" : "#94a3b8"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
