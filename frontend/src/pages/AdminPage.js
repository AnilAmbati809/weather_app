import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Access denied. Only admin can view users.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <div className="badge">Admin</div>
          <h2 className="card-title">Admin Panel</h2>
          <p className="card-subtitle">View and manage all registered users.</p>
        </div>

        <table style={{ width: "100%", marginTop: "10px", fontSize: "14px" }}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Username</th>
              <th align="left">Email</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ paddingTop: "10px" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
