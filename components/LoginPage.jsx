import React, { useState } from "react";
import { supabaseService } from "../supabase/services.js";

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Supabase Auth: LOGIN - handleSubmit() authenticates a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const { user } = await supabaseService.signIn(email, password);
      onLogin({ uid: user.id, email: user.email });
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "100vh", background: "#f8fafc" }}
    >
      <div className="d-flex flex-grow-1 justify-content-center align-items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white rounded shadow animate-fadeIn"
          style={{ minWidth: 320, width: "100%", maxWidth: 400 }}
        >
          <h2 className="mb-4 text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() =>
                window.navigateToRegister && window.navigateToRegister()
              }
            >
              Don't have an account? Register
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
          Welcome Back
        </h2>
        <p style={{ fontSize: "1.1rem", maxWidth: 400 }}>
          Manage your cases securely and stay productive with your LawOffice
          Management System.
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
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
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
