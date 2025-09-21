import React, { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User } from "lucide-react";
import { firebaseService } from "../firebase/services.js";

export function CalendarPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      const appointmentsData = await firebaseService.getAll("appointments");
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = new Date(appointment.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-dark">Calendar</h2>
        </div>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-dark">Calendar</h2>
          <p className="text-muted">Manage appointments and schedule</p>
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#212529",
            fontSize: "1rem",
            fontFamily: "inherit",
            padding: "10px 16px",
            borderRadius: "8px",
            letterSpacing: "0.01em",
          }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} style={{ marginRight: "8px" }} />
          Schedule Appointment
        </button>
      </div>

      {/* Calendar View */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="empty-state">
              <Calendar className="empty-state-icon" size={64} />
              <h5 className="fw-medium text-dark mb-2">
                No appointments scheduled
              </h5>
              <p className="text-muted mb-4">
                Schedule your first appointment to get started.
              </p>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#212529",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  letterSpacing: "0.01em",
                }}
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} style={{ marginRight: "8px" }} />
                Schedule Your First Appointment
              </button>
              {/* Modal for Scheduling Appointment */}
              <div
                className={`modal fade${showModal ? " show d-block" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={showModal ? { background: "rgba(0,0,0,0.5)" } : {}}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Schedule Appointment</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {/* Appointment creation form goes here */}
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter appointment title"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Date</label>
                          <input type="date" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Time</label>
                          <input type="time" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Client Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter client name"
                          />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#212529",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          letterSpacing: "0.01em",
                        }}
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#212529",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          letterSpacing: "0.01em",
                        }}
                      >
                        Save Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      </div>
                      <button className="btn btn-outline-primary btn-sm">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
