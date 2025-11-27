import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const ResetPassword = () => {
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://job-platform-hackathon.onrender.com/api/users/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message);

      // ⭐ Redirect to login ALWAYS if request was successful
      if (res.ok) {
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
