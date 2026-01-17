import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });

      if (data.user.role === "admin") {
        setError("Admin must login via admin panel");
        return;
      }

      // Save token & user in AuthContext
      login({ token: data.token, user: data.user });

      // Role-based redirect
      if (data.user.role === "mentor") {
        navigate("/mentor");
      } else {
        navigate("/intern");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-8">Welcome Back</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Login
          </button>
        </form>

        <p className="text-center mt-6" style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{" "}
          <span
            style={{ color: 'var(--color-primary-light)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

