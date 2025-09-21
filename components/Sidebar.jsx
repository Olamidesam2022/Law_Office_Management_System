import React from "react";
import {
  LayoutGrid,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Scale,
  X,
} from "lucide-react";

export function Sidebar({ currentPage, onPageChange, isOpen, onClose }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "clients", label: "Clients", icon: Users },
    { id: "cases", label: "Cases", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="sidebar d-none d-md-flex flex-column"
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          padding: "1rem",
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center mb-4">
          <Scale size={26} color="white" />
          <span className="ms-2 fw-bold">LawFirm</span>
        </div>
        <br />
        <br />
        <br />

        {/* Navigation Menu */}
        <nav className="flex-grow-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-100 text-start d-flex align-items-center px-3 py-2 mb-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-light"
                }`}
                style={{ border: "none", background: "transparent" }}
              >
                <Icon size={20} className="me-2" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="mobile-sidebar d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000,
          }}
        >
          <div
            className="bg-white shadow p-4"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            {/* Header with Close */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <Scale size={24} color="#2563eb" />
                <span className="ms-2 fw-bold text-dark">LawFirm</span>
              </div>
              <button
                onClick={onClose}
                style={{ border: "none", background: "transparent" }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      onClose();
                    }}
                    className={`w-100 text-start d-flex align-items-center px-3 py-2 mb-2 rounded ${
                      isActive ? "bg-primary text-white" : "text-dark"
                    }`}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <Icon size={20} className="me-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
