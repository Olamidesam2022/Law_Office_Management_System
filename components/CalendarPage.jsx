import React, { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User, Edit, Trash } from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function CalendarPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && user.uid) {
      firebaseService.setUserId(user.uid);
      loadAppointments();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await firebaseService.getAll("appointments");
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
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
      const newAppointment = { title, date, time, clientName, status };

      if (selectedAppointment) {
        // Update existing
        await firebaseService.update(
          "appointments",
          selectedAppointment.id,
          newAppointment
        );
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id ? { ...a, ...newAppointment } : a
          )
        );
      } else {
        // Create new
        const created = await firebaseService.create(
          "appointments",
          newAppointment
        );
        setAppointments((prev) => [
          { id: created.id, ...newAppointment },
          ...prev,
        ]);
      }

      // Reset form
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
      await firebaseService.delete("appointments", id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Group by date
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const d = new Date(appointment.date).toDateString();
    if (!groups[d]) groups[d] = [];
    groups[d].push(appointment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div>
        <h2 className="fw-semibold text-dark">Calendar</h2>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Calendar</h2>
          <p className="text-muted">Manage appointments and schedule</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedAppointment(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} className="me-2" />
          Schedule Appointment
        </button>
      </div>

      {/* Calendar View */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="alert alert-info">No appointments scheduled.</div>
      ) : (
        <div>
          {Object.entries(groupedAppointments).map(
            ([date, dayAppointments]) => (
              <div key={date} className="custom-card mb-4">
                <div className="custom-card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <Calendar size={20} className="me-2" />
                    {date}
                  </h5>
                </div>
                <div className="custom-card-body">
                  {dayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="d-flex align-items-center justify-content-between p-3 border rounded mb-2"
                    >
                      <div>
                        <h6 className="mb-1">{appointment.title}</h6>
                        <div
                          className="d-flex align-items-center text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          <Clock size={16} className="me-1" />
                          {appointment.time}
                          {appointment.clientName && (
                            <>
                              <span className="mx-2">•</span>
                              <User size={16} className="me-1" />
                              {appointment.clientName}
                            </>
                          )}
                        </div>
                        <span className="badge bg-secondary mt-1">
                          {appointment.status}
                        </span>
                      </div>
                      <div>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setTitle(appointment.title);
                            setDate(appointment.date);
                            setTime(appointment.time);
                            setClientName(appointment.clientName);
                            setStatus(appointment.status);
                            setShowModal(true);
                          }}
                        >
                          <Edit size={14} className="me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                        >
                          <Trash size={14} className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Modal (Create/Edit) */}
      <div
        className={`modal fade${showModal ? " show d-block" : ""}`}
        style={showModal ? { background: "rgba(0,0,0,0.5)" } : {}}
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom">
              <h5 className="modal-title">
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
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <small className="text-danger">{errors.title}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {errors.date && (
                    <small className="text-danger">{errors.date}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  {errors.time && (
                    <small className="text-danger">{errors.time}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  {errors.clientName && (
                    <small className="text-danger">{errors.clientName}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="taken">Taken</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer border-top">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveAppointment}
              >
                {selectedAppointment
                  ? "Update Appointment"
                  : "Save Appointment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
