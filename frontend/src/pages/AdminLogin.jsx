import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password
      });

      // Save token
      localStorage.setItem("adminToken", res.data.token);

      setSuccess("Admin login successful!");

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/admin-dashboard";
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Login</button>

      </form>
    </div>
  );
};

export default AdminLogin;
