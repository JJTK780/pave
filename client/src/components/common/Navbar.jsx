import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

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

  const getRoleBadgeClass = () => {
    if (user.role === "admin") return "badge-admin";
    if (user.role === "mentor") return "badge-mentor";
    return "badge-intern";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleHomeClick}>
        <span>Roadmap Tracker</span>
      </div>

      <div className="navbar-actions">
        <span className={`badge ${getRoleBadgeClass()}`}>
          {user.role}
        </span>
        <ThemeToggle />
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

