import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });

      const { token, role } = res.data;

      // Save the login data
      login(token, role, username);

      // Redirect based on role
      if (role === "ROLE_ADMIN") {
        navigate("/admin");       // 👈 Admin goes here
      } else {
        navigate("/dashboard");   // 👈 Normal user goes here
      }

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="app-shell">
      <div className="card auth-card">
        <div className="card-header">
          <div className="badge">Weather App</div>
          <h2 className="card-title">Welcome back 👋</h2>
          <p className="card-subtitle">
            Login to search weather and manage your favourite locations.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-error">{error}</p>}

          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <span className="text-muted">
            New here?{" "}
            <Link to="/register" className="link">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
