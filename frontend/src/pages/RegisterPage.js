import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/auth/register", form);
      setMsg("Registered successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setMsg("Registration failed (username/email may already exist).");
    }
  };

  return (
    <div className="app-shell">
      <div className="card auth-card">
        <div className="card-header">
          <div className="badge">Weather App</div>
          <h2 className="card-title">Create account</h2>
          <p className="card-subtitle">
            Sign up to start searching weather for any city.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            className="input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {msg && <p className="text-muted">{msg}</p>}

          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <span className="text-muted">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
