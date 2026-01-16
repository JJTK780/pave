import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const getRoleBadgeClass = (role) => {
    if (role === "admin") return "badge-admin";
    if (role === "mentor") return "badge-mentor";
    return "badge-intern";
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId) => {
    try {
      setActionLoading(userId);
      await api.patch(`/admin/users/${userId}/promote`);
      fetchUsers();
      alert("User promoted to mentor");
    } catch (err) {
      alert("Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="content-wrapper">
          <div className="loading-text">Loading users...</div>
        </div>
      </>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <>
        <Navbar />
        <div className="content-wrapper">
          <div className="alert alert-info">No users found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">User Management</h2>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.role === "intern" ? (
                      <button
                        onClick={() => promoteUser(user._id)}
                        disabled={actionLoading === user._id}
                        className="btn btn-success btn-sm"
                      >
                        {actionLoading === user._id
                          ? "Promoting..."
                          : "Promote to Mentor"}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
