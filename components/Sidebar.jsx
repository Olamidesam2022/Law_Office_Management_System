import {
  LayoutGrid,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Scale,
} from "lucide-react";

export function Sidebar({
  currentPage,
  onPageChange,
  showSidebar,
  setShowSidebar,
  onLogout,
}) {
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
      className={` d-lg-flex flex-column ${
        showSidebar ? "show d-flex" : "d-none"
      }`}
      style={{
        width: "250px",
        background: "#0f172a",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 10000,
        padding: "1rem",
      }}
    >
      {/* Sidebar Header */}
      <div className="d-flex align-items-center mb-4">
        <Scale size={26} color="white" />
        <span
          className="ms-2 fw-bold animated-text"
          style={{
            fontSize: "17px",
            fontWeight: "800",
            lineHeight: "1.2",
            background:
              "linear-gradient(270deg, #2563eb, #f7f7f7ff, #6082e2ff)",
            backgroundSize: "600% 600%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradientShift 6s ease infinite",
          }}
        >
          LawOffice
          <br />
          Management System
        </span>
      </div>

      <br />

      {/* Navigation Menu */}
      <nav className="flex-grow-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setShowSidebar(false);
              }}
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

      <button
        className="btn btn-outline-danger ms-2 d-block d-lg-none"
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

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}
