import React, { useState } from "react";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo: accept any non-empty username/password
    if (username && password) {
      onLogin(username);
    } else {
      setError("Please enter username and password.");
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
        style={{ minWidth: 320 }}
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
    </div>
  );
}
