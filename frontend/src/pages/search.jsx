import { useState, useContext } from "react";
import "../styles/search.css";
import { AuthContext } from "../context/authcontext";

const SearchPage = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);

    if (!user) {
      setError("Please login to search nearby workers.");
      return;
    }

    if (!query.trim()) {
      setError("Please enter a work type (e.g. carpenter)");
      return;
    }

    try {
      // ⭐ send both query + district
      const res = await fetch(
        `https://job-platform-hackathon.onrender.com/api/users/search/${query}/${user.district}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "No workers found");
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Failed to fetch data. Try again.");
    }
  };

  return (
    <div className="search-page">
      <h2>Find Workers Near You</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by work type (e.g. carpenter, driver)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length === 0 && !error && (
        <p className="no-results">No workers found in your district.</p>
      )}

      <div className="results">
        {results.map((user) => (
          <div key={user._id} className="worker-card">
            <div className="profile-photo-box">
              {user.profilePhoto ? (
                <img
                  src={`https://job-platform-hackathon.onrender.com${user.profilePhoto}`}
                  alt={user.name}
                  className="profile-pic"
                />
              ) : (
                <div className="no-photo-box">
                  No Profile
                </div>
              )}
            </div>
            <h3>{user.name}</h3>
            <p>
              <strong>Work:</strong> {user.workType}
            </p>
            <p>
              <strong>District:</strong> {user.district}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <a href={`tel:${user.phone}`} className="call-btn">
              📞 Call Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
