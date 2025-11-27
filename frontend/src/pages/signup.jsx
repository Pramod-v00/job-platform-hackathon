import { useState } from "react";
import { signupUser } from "../services/authservice";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("");

  const [workType, setWorkType] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔥 Phone number check
    if (phone.length !== 10) {
      return setError("Phone number must be exactly 10 digits.");
    }

    if (!name || !phone || !password || !district) {
      return setError("All fields required.");
    }

    try {
      await signupUser({
        name,
        phone,
        password,
        district,
        workType: workType || "", // 🔥 send workType also
      });

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        
        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* PHONE */}
        <input
          type="text"
          maxLength="10"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* DISTRICT */}
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">Select District</option>
          <option value="Bagalkot">Bagalkot</option>
          <option value="Ballari">Ballari</option>
          <option value="Belagavi">Belagavi</option>
          <option value="Bengaluru Urban">Bengaluru Urban</option>
          <option value="Bengaluru Rural">Bengaluru Rural</option>
          <option value="Bidar">Bidar</option>
          <option value="Chamarajanagar">Chamarajanagar</option>
          <option value="Chikkaballapur">Chikkaballapur</option>
          <option value="Chikkamagaluru">Chikkamagaluru</option>
          <option value="Chitradurga">Chitradurga</option>
          <option value="Dakshina Kannada">Dakshina Kannada</option>
          <option value="Davanagere">Davanagere</option>
          <option value="Dharwad">Dharwad</option>
          <option value="Gadag">Gadag</option>
          <option value="Hassan">Hassan</option>
          <option value="Haveri">Haveri</option>
          <option value="Kalaburagi">Kalaburagi</option>
          <option value="Kodagu">Kodagu</option>
          <option value="Kolar">Kolar</option>
          <option value="Koppal">Koppal</option>
          <option value="Mandya">Mandya</option>
          <option value="Mysuru">Mysuru</option>
          <option value="Raichur">Raichur</option>
          <option value="Ramanagara">Ramanagara</option>
          <option value="Shivamogga">Shivamogga</option>
          <option value="Tumakuru">Tumakuru</option>
          <option value="Udupi">Udupi</option>
          <option value="Uttara Kannada">Uttara Kannada</option>
          <option value="Vijayapura">Vijayapura</option>
          <option value="Yadgir">Yadgir</option>
        </select>

        {/* WORK TYPE */}
        <select
          value={isOtherSelected ? "Other" : workType}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "Other") {
              setIsOtherSelected(true);
              setWorkType("");
            } else {
              setIsOtherSelected(false);
              setWorkType(value);
            }
          }}
        >
          <option value="">Select Work Type (optional)</option>
          <option value="Painter">Painter</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Driver">Driver</option>
          <option value="Mechanic">Mechanic</option>
          <option value="House Helper">House Helper</option>
          <option value="Other">Other</option>
        </select>

        {/* OTHER WORK TYPE INPUT */}
        {isOtherSelected && (
          <input
            type="text"
            placeholder="Enter your work type"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          />
        )}

        {/* ERROR / SUCCESS */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
