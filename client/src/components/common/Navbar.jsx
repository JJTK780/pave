import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // don't show if not logged in

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleHomeClick = () => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "mentor") {
      navigate("/mentor");
    } else {
      navigate("/intern");
    }
  };

  return (
    <div style={styles.nav}>
      <span style={styles.title} onClick={handleHomeClick}>
        Roadmap Tracker
      </span>

      <div>
        <span style={styles.role}>{user.role.toUpperCase()}</span>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
    marginBottom: "20px",
  },
  title: {
    fontWeight: "bold",
    cursor: "pointer",
  },
  role: {
    marginRight: "10px",
    fontSize: "14px",
  },
  button: {
    cursor: "pointer",
  },
};

export default Navbar;
