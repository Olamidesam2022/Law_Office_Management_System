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
  const [searchQuery, setSearchQuery] = useState("");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={user} searchQuery={searchQuery} />;
      case "clients":
        return <ClientsPage user={user} searchQuery={searchQuery} />;
      case "cases":
        return <CasesPage user={user} searchQuery={searchQuery} />;
      case "documents":
        return <DocumentsPage user={user} searchQuery={searchQuery} />;
      case "billing":
        return <BillingPage user={user} searchQuery={searchQuery} />;
      case "calendar":
        return <CalendarPage user={user} searchQuery={searchQuery} />;
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
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onSearchSubmit={setSearchQuery}
    >
      {renderCurrentPage()}
    </Layout>
  );
}
