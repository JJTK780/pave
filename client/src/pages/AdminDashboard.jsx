import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const getRoleStyle = (role) => {
    if (role === "admin") return { color: "red", fontWeight: "bold" };
    if (role === "mentor") return { color: "green", fontWeight: "bold" };
    return { color: "blue" };
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

  if (loading) return <p>Loading users...</p>;
  if (!loading && users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        <table border="1" cellPadding="10">
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
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td style={getRoleStyle(user.role)}>
                  {user.role.toUpperCase()}
                </td>

                <td>
                  {user.role === "intern" ? (
                    <button
                      onClick={() => promoteUser(user._id)}
                      disabled={actionLoading === user._id}
                    >
                      {actionLoading === user._id
                        ? "Promoting..."
                        : "Promote to Mentor"}
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
