import React, { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User, Edit, Trash } from "lucide-react";
import { supabaseService } from "../supabase/services.js";

export function CalendarPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.uid) {
      supabaseService.userId = user.uid;
      loadAppointments();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getAll("calendar_events");
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!clientName.trim()) newErrors.clientName = "Client name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAppointment = async () => {
    if (!validateForm()) return;

    try {
      const newAppointment = {
        title,
        description: clientName || null,
        starts_at:
          date && time ? new Date(`${date}T${time}:00Z`).toISOString() : null,
        ends_at: null,
        completed: selectedAppointment ? status === "completed" : false,
        status,
      };

      if (selectedAppointment) {
        await supabaseService.update(
          "calendar_events",
          selectedAppointment.id,
          newAppointment
        );
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id ? { ...a, ...newAppointment } : a
          )
        );
      } else {
        const created = await supabaseService.create(
          "calendar_events",
          newAppointment
        );
        setAppointments((prev) => [
          { id: created.id, ...newAppointment },
          ...prev,
        ]);
      }

      setTitle("");
      setDate("");
      setTime("");
      setClientName("");
      setStatus("scheduled");
      setErrors({});
      setSelectedAppointment(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await supabaseService.delete("calendar_events", id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const d = new Date(
      appointment.starts_at || appointment.date
    ).toDateString();
    if (!groups[d]) groups[d] = [];
    groups[d].push(appointment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="container-fluid px-2 calendar-bg">
        <h2 className="fw-semibold text-dark">Calendar</h2>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 calendar-bg">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Calendar</h2>
          <p className="text-muted">Manage appointments and schedule</p>
        </div>
        <button
          className="btn btn-primary-custom px-3 mt-0"
          onClick={() => {
            setSelectedAppointment(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} className="me-2" />
          Schedule Appointment
        </button>
      </div>

      {/* Appointments */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="alert alert-info">No appointments scheduled.</div>
      ) : (
        Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
          <div key={date} className="card shadow-sm border-0 mb-4 rounded-4">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 d-flex align-items-center text-primary fw-semibold">
                <Calendar size={20} className="me-2 text-primary" />
                {date}
              </h5>
            </div>
            <div className="card-body">
              {dayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="d-flex align-items-center justify-content-between border rounded-3 p-3 mb-3 bg-white shadow-sm hover-card"
                  style={{ transition: "all 0.2s ease" }}
                >
                  <div>
                    <h6 className="fw-semibold mb-1 text-dark">
                      {appointment.title}
                    </h6>
                    <div className="d-flex align-items-center text-muted small">
                      <Clock size={15} className="me-1 text-secondary" />
                      {appointment.starts_at
                        ? new Date(appointment.starts_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "—"}
                      {appointment.description && (
                        <>
                          <span className="mx-2">•</span>
                          <User size={15} className="me-1 text-secondary" />
                          {appointment.description}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        appointment.status === "completed"
                          ? "bg-success"
                          : appointment.status === "taken"
                          ? "bg-warning text-dark"
                          : "bg-primary"
                      }`}
                    >
                      {appointment.status || "scheduled"}
                    </span>
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setTitle(appointment.title);
                        setDate(
                          appointment.starts_at
                            ? new Date(appointment.starts_at)
                                .toISOString()
                                .slice(0, 10)
                            : ""
                        );
                        setTime(
                          appointment.starts_at
                            ? new Date(appointment.starts_at)
                                .toISOString()
                                .slice(11, 16)
                            : ""
                        );
                        setClientName(appointment.description || "");
                        setStatus(appointment.status || "scheduled");
                        setShowModal(true);
                      }}
                    >
                      <Edit size={14} className="me-1" />
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash size={14} className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-semibold text-dark">
                  {selectedAppointment
                    ? "Edit Appointment"
                    : "Schedule Appointment"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                      <small className="text-danger">{errors.title}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    {errors.date && (
                      <small className="text-danger">{errors.date}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Time</label>
                    <input
                      type="time"
                      className="form-control rounded-3"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    {errors.time && (
                      <small className="text-danger">{errors.time}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                    {errors.clientName && (
                      <small className="text-danger">{errors.clientName}</small>
                    )}
                  </div>
                  {selectedAppointment && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select rounded-3"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="taken">Taken</option>
                      </select>
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  className="btn btn-light border px-3"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn border px-3"
                  onClick={handleSaveAppointment}
                >
                  {selectedAppointment ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          .btn-primary-custom {
            background-color: #2563eb;
            color: #fff;
            border: 1px solid rgba(15, 23, 42, 0.06);
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
}
