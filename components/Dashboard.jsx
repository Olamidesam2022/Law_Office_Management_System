import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeCases: 0,
    totalDocuments: 0,
    monthlyRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load data from Firebase collections
      const [clients, cases, documents, invoices] = await Promise.all([
        firebaseService.getAll("clients"),
        firebaseService.getAll("cases"),
        firebaseService.getAll("documents"),
        firebaseService.getAll("invoices"),
      ]);

      // Calculate stats
      const activeCases = cases.filter(
        (caseItem) => caseItem.status !== "closed"
      ).length;
      const monthlyRevenue = invoices
        .filter((invoice) => {
          const invoiceDate = new Date(invoice.date);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return (
            invoiceDate.getMonth() === currentMonth &&
            invoiceDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);

      setStats({
        totalClients: clients.length,
        activeCases: activeCases,
        totalDocuments: documents.length,
        monthlyRevenue: monthlyRevenue,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      iconClass: "blue",
    },
    {
      title: "Active Cases",
      value: stats.activeCases,
      icon: Briefcase,
      iconClass: "green",
    },
    {
      title: "Documents",
      value: stats.totalDocuments,
      icon: FileText,
      iconClass: "purple",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconClass: "emerald",
    },
  ];

  if (loading) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="fw-semibold text-dark">Dashboard</h2>
          <p className="text-muted">Overview of your law practice</p>
        </div>
        <div className="row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3 mb-4">
              <div className="stat-card">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "80px" }}
                >
                  <div className="loading-spinner"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-semibold text-dark">Dashboard</h2>
        <p className="text-muted">Overview of your law practice</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="col-12 col-md-6 col-lg-3 mb-4">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div
                      className="text-muted fw-medium"
                      style={{ fontSize: "14px" }}
                    >
                      {stat.title}
                    </div>
                    <div
                      className="fw-semibold text-dark mt-1"
                      style={{ fontSize: "24px" }}
                    >
                      {stat.value}
                    </div>
                  </div>
                  <div className={`stat-icon ${stat.iconClass}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="mb-0 d-flex align-items-center">
                <AlertTriangle size={20} color="#f59e0b" className="me-2" />
                Recent Alerts
              </h5>
            </div>
            <div className="custom-card-body">
              <div className="empty-state">
                <AlertTriangle className="empty-state-icon" size={48} />
                <p className="text-muted mb-1">No alerts at this time</p>
                <small className="text-muted">
                  Alerts for deadlines and overdue items will appear here
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 mb-4">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="mb-0 d-flex align-items-center">
                <Calendar size={20} color="#2563eb" className="me-2" />
                Upcoming Appointments
              </h5>
            </div>
            <div className="custom-card-body">
              <div className="empty-state">
                <Calendar className="empty-state-icon" size={48} />
                <p className="text-muted mb-1">No upcoming appointments</p>
                <small className="text-muted">
                  Your scheduled appointments will appear here
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
