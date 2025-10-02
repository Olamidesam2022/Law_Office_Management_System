import React, { useState } from "react";
import { auth } from "../firebase/config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function RegisterPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Firebase Auth: REGISTER - handleSubmit() registers a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please enter name, email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      onRegister({ uid: user.uid, email: user.email, name });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("User already exists with this email.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "100vh", background: "#f8fafc" }}
    >
      {/* Left Side: Form */}
      <div className="d-flex flex-grow-1 justify-content-center align-items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white rounded shadow animate-fadeIn"
          style={{ minWidth: 320, width: "100%", maxWidth: 400 }}
        >
          <h2 className="mb-4 text-center">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => window.navigateToLogin && window.navigateToLogin()}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>

      <div
        className="d-none d-md-flex flex-grow-1 justify-content-center align-items-center text-white animate-slideIn"
        style={{
          background: "url('/images/law.jpg')",
          backgroundSize: "cover",
          padding: "2rem",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontWeight: "700", marginBottom: "1rem" }}>
          📝 Create Your Account
        </h2>
        <p style={{ fontSize: "1.1rem", maxWidth: 400 }}>
          Start managing your law office with an all-in-one system. Easy,
          secure, and efficient.
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .animate-slideIn {
            animation: slideIn 1s ease-out forwards;
          }
          @media (max-width: 576px) {
            form.p-4 {
              padding: 1rem !important;
              min-width: 0 !important;
              max-width: 100vw !important;
            }
          }
        `}
      </style>
    </div>
  );
}
