import React, { useState, useEffect } from "react";
import { supabaseService } from "./supabase/services";

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
  const [loading, setLoading] = useState(true);
  
  // Check for existing session on load
  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await supabaseService.getCurrentUser();
        if (currentUser) {
          setUser({ uid: currentUser.id, email: currentUser.email });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkUser();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            searchQuery={searchQuery}
            onPageChange={setCurrentPage}
          />
        );
      case "clients":
        return (
          <ClientsPage
            user={user}
            searchQuery={searchQuery}
            onPageChange={setCurrentPage}
          />
        );
      case "cases":
        return <CasesPage user={user} searchQuery={searchQuery} />;
      case "documents":
        return <DocumentsPage user={user} searchQuery={searchQuery} />;
      case "billing":
        return <BillingPage user={user} searchQuery={searchQuery} />;
      case "calendar":
        return <CalendarPage user={user} searchQuery={searchQuery} />;
      default:
        return (
          <Dashboard
            user={user}
            searchQuery={searchQuery}
            onPageChange={setCurrentPage}
          />
        );
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

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
      setShowRegister(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
