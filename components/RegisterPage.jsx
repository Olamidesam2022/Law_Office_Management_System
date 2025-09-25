import React, { useState } from "react";
import { auth } from "../firebase/config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function RegisterPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please enter name, email and password.");
      return;
    }
    // Simple email format check
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
      // Pass name along with uid and email
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
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f8fafc" }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded shadow"
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
      </form>
      {/* Responsive styles */}
      <style>
        {`
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
