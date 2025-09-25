import React, { useState } from "react";
import { auth } from "../firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      onLogin({ uid: user.uid, email: user.email });
    } catch (err) {
      setError("Invalid email or password.");
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
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
