import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { supabaseService } from "../supabase/services.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function Dashboard({ user, onPageChange }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeCases: 0,
    totalDocuments: 0,
    monthlyRevenue: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      supabaseService.userId = user.uid;
      loadDashboardData();
      loadAppointments();
      loadRevenueData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [clients, cases, documents, invoices] = await Promise.all([
        supabaseService.getAll("clients"),
        supabaseService.getAll("cases"),
        supabaseService.getAll("documents"),
        supabaseService.getAll("billing"),
      ]);

      const activeCases = cases.filter((c) => c.status !== "closed").length;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const monthlyRevenue = invoices
        .filter((invoice) => {
          const invoiceDate = invoice.date || invoice.due_date;
          if (!invoiceDate) return false;
          const d = new Date(invoiceDate);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      setStats({
        totalClients: clients.length,
        activeCases,
        totalDocuments: documents.length,
        monthlyRevenue,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Load upcoming appointments from Supabase ---
  const loadAppointments = async () => {
    try {
      const appts = await supabaseService.getAll("calendar_events");
      const today = new Date().toISOString().split("T")[0];

      const scheduled = appts
        .filter((a) => a.status === "scheduled")
        .sort(
          (a, b) =>
            new Date(a.starts_at || a.date) - new Date(b.starts_at || b.date)
        );

      setAppointments(scheduled.slice(0, 5));
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  // --- Mark appointment as complete ---
  const markComplete = async (id) => {
    try {
      await supabaseService.update("calendar_events", id, {
        status: "completed",
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  // --- Load monthly revenue chart data ---
  const loadRevenueData = async () => {
    try {
      const invoices = await supabaseService.getAll("billing");
      const monthlyMap = {};

      invoices.forEach((inv) => {
        const invoiceDate = inv.date || inv.due_date;
        if (!invoiceDate || !inv.amount) return;
        const d = new Date(invoiceDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + inv.amount;
      });

      const sortedKeys = Object.keys(monthlyMap).sort();
      setRevenueData(
        sortedKeys.map((month) => ({
          month,
          revenue: monthlyMap[month],
        }))
      );
    } catch (err) {
      console.error("Error loading revenue data:", err);
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

  return (
    <div className="container-fluid px-2 px-md-4">
      <div className="mb-4">
        <h2 className="fw-semibold text-dark">Dashboard</h2>
        <p className="text-muted">Overview of your law practice</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="row mb-4">
        {(loading ? [1, 2, 3, 4] : statCards).map((stat, i) => {
          const Icon = !loading ? stat.icon : null;
          return (
            <div key={i} className="col-12 col-md-6 col-lg-3 mb-4">
              <div className="stat-card" style={{ minWidth: "220px" }}>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "80px" }}
                  >
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Charts and Upcoming Appointments --- */}
      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="custom-card" style={{ minWidth: "260px" }}>
            <div className="custom-card-header">
              <h5 className="mb-0">Monthly Revenue</h5>
            </div>
            <div className="custom-card-body" style={{ height: "320px" }}>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#4F46E5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center mt-4">
                  No revenue data available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 mb-4">
          <div className="custom-card" style={{ minWidth: "260px" }}>
            <div className="custom-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <Calendar size={20} color="#2563eb" className="me-2" />
                Upcoming Appointments
              </h5>
              <button
                className="btn btn-link btn-sm"
                onClick={() => onPageChange("calendar")}
              >
                View All
              </button>
            </div>
            <div className="custom-card-body">
              {appointments.length > 0 ? (
                <ul className="list-group">
                  {appointments.map((appt) => (
                    <li
                      key={appt.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">{appt.title}</div>
                        <small className="text-muted">
                          {new Date(
                            appt.starts_at || appt.date
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            appt.starts_at || appt.date
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => markComplete(appt.id)}
                      >
                        <CheckCircle size={16} className="me-1" />
                        Mark Complete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state text-center">
                  <Calendar className="empty-state-icon" size={48} />
                  <p className="text-muted mb-1">No upcoming appointments</p>
                  <small className="text-muted">
                    Your scheduled appointments will appear here
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
