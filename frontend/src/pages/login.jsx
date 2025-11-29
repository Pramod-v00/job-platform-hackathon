import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { loginUser } from "../services/authservice";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);   // ⭐ added loading

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      setError("Phone and password required");
      return;
    }

    try {
      setLoading(true); // ⭐ Start spinner

      const user = await loginUser({ phone, password });
      login(user);

      setSuccess("Login successful! Redirecting to home...");
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setSuccess("");
    } finally {
      setLoading(false); // ⭐ Stop spinner
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error / Success */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* ⭐ Button with loader */}
        <button type="submit" disabled={loading}>
          {loading ? <div className="login-spinner"></div> : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "right", marginTop: "10px" }}>
        <a href="/admin-login" style={{ fontSize: "14px" }}>
          Admin Login
        </a>
      </p>

      <p style={{ marginTop: "10px" }}>
        <Link to="/reset-password" className="forgot-link">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default Login;
