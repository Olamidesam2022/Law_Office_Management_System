import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { firebaseService } from "../firebase/services.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

export function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeCases: 0,
    totalDocuments: 0,
    monthlyRevenue: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      firebaseService.setUserId(user.uid);
      loadDashboardData();
      loadAppointments();
      loadRevenueData();
    }
  }, [user]);

  // 📊 Load stats
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [clients, cases, documents, invoices] = await Promise.all([
        firebaseService.getAll("clients"),
        firebaseService.getAll("cases"),
        firebaseService.getAll("documents"),
        firebaseService.getAll("invoices"),
      ]);

      const activeCases = cases.filter(
        (caseItem) => caseItem.status !== "closed"
      ).length;

      const monthlyRevenue = invoices
        .filter((invoice) => {
          const invoiceDate = new Date(invoice.date);
          const now = new Date();
          return (
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);

      setStats({
        totalClients: clients.length,
        activeCases,
        totalDocuments: documents.length,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📅 Load only upcoming appointments (limit to 5)
  const loadAppointments = async () => {
    try {
      const appts = await firebaseService.getAll("appointments");
      const today = new Date().toISOString().split("T")[0];

      const scheduled = appts.filter(
        (a) =>
          a.userId === user.uid && a.status === "scheduled" && a.date >= today
      );

      // Sort by nearest date and take only first 5
      scheduled.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(scheduled.slice(0, 5));
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  // ✅ Mark appointment complete
  const markComplete = async (id) => {
    try {
      await firebaseService.update("appointments", id, { status: "completed" });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  // 💰 Load revenue grouped by month
  const loadRevenueData = async () => {
    try {
      const invoices = await firebaseService.getAll("invoices");
      const monthlyMap = {};

      invoices.forEach((invoice) => {
        if (!invoice.date || !invoice.amount) return;
        const date = new Date(invoice.date);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + invoice.amount;
      });

      const chartData = Object.keys(monthlyMap).map((month) => ({
        month,
        revenue: monthlyMap[month],
      }));

      setRevenueData(chartData);
    } catch (err) {
      console.error("Error loading revenue data:", err);
    }
  };

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients.toLocaleString(),
      icon: Users,
      iconClass: "blue",
    },
    {
      title: "Active Cases",
      value: stats.activeCases.toLocaleString(),
      icon: Briefcase,
      iconClass: "green",
    },
    {
      title: "Documents",
      value: stats.totalDocuments.toLocaleString(),
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
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-semibold text-dark">Dashboard</h2>
        <p className="text-muted">Overview of your law practice</p>
      </div>

      {/* Stats Cards */}
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

      {/* Revenue Bar Chart & Appointments */}
      <div className="row">
        {/* Revenue Bar Chart */}
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

        {/* Upcoming Appointments */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="custom-card" style={{ minWidth: "260px" }}>
            <div className="custom-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <Calendar size={20} color="#2563eb" className="me-2" />
                Upcoming Appointments
              </h5>
              <button
                className="btn btn-link btn-sm"
                onClick={() => navigate("/calendar")}
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
                          {new Date(appt.date).toLocaleDateString()} at{" "}
                          {appt.time}
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

      {/* Responsive tweaks */}
      <style>
        {`
          @media (max-width: 576px) {
            .stat-card, .custom-card {
              padding: 0.5rem;
            }
          }
        `}
      </style>
    </div>
  );
}
