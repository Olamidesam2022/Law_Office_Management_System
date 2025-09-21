import React, { useState } from "react";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Layout } from "./components/Layout";

import { Dashboard } from "./components/Dashboard";
import { ClientsPage } from "./components/ClientsPage";
import { CasesPage } from "./components/CasesPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { BillingPage } from "./components/BillingPage";
import { CalendarPage } from "./components/CalendarPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "clients":
        return <ClientsPage user={user} />;
      case "cases":
        return <CasesPage user={user} />;
      case "documents":
        return <DocumentsPage user={user} />;
      case "billing":
        return <BillingPage user={user} />;
      case "calendar":
        return <CalendarPage user={user} />;
      default:
        return <Dashboard />;
    }
  };

  // Expose navigation for LoginPage button
  window.navigateToRegister = () => setShowRegister(true);
  window.navigateToLogin = () => setShowRegister(false);

  if (!user) {
    if (showRegister) {
      return <RegisterPage onRegister={() => setShowRegister(false)} />;
    }
    return <LoginPage onLogin={setUser} />;
  }

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      user={user}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </Layout>
  );
}
