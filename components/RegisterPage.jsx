import React, { useState } from "react";
import { motion } from "motion/react";
import { supabaseService } from "../supabase/services.js";

export function RegisterPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Supabase Auth: REGISTER - handleSubmit() creates a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await supabaseService.signUp(email, password, { name });
      onRegister();
    } catch (err) {
      setError(err.message || "Error creating account");
    }
  };

  return (
    <div
      className="position-relative overflow-hidden d-flex justify-content-center align-items-center p-4"
      style={{
        minHeight: "100vh",
        background: "url('/images/law.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for better contrast */}
      <div
        className="position-absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        }}
      />

      {/* Glassy register form */}
      <motion.form
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="position-relative p-4 rounded shadow-lg glassmorphism"
        style={{
          minWidth: 320,
          width: "100%",
          maxWidth: 420,
          zIndex: 2,
        }}
      >
        <h2 className="mb-4 text-center text-white">Register</h2>
        {error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="alert alert-danger"
          >
            {error}
          </motion.div>
        )}
        <div className="mb-3">
          <label className="form-label text-white">Name</label>
          <input
            type="text"
            className="form-control glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Email</label>
          <input
            type="email"
            className="form-control glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Password</label>
          <input
            type="password"
            className="form-control glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Confirm Password</label>
          <input
            type="password"
            className="form-control glass-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn btn-primary w-100"
          style={{
            background: "rgba(59, 130, 246, 0.9)",
            border: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          Register
        </motion.button>
        <div className="mt-3 text-center">
          <button
            type="button"
            className="btn btn-link p-0 text-white"
            style={{ textDecoration: "none", opacity: 0.9 }}
            onClick={() => window.navigateToLogin && window.navigateToLogin()}
          >
            Already have an account? Login
          </button>
        </div>
      </motion.form>

      {/* Responsive styles */}
      <style>
        {`
          .glassmorphism {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          }

          .glass-input {
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            transition: all 0.3s ease;
          }

          .glass-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          .glass-input:focus {
            background: rgba(255, 255, 255, 0.25) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2) !important;
            color: white !important;
          }

          @media (max-width: 576px) {
            .glassmorphism {
              padding: 1.5rem !important;
              min-width: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}
