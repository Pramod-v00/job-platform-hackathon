import React, { useEffect, useState } from "react";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    password: "",
    workType: "",
  });

  // Load user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        district: storedUser.district || "",
        password: "",
        workType: storedUser.workType || "",
      });
    }
  }, []);

  // Fetch only this user's jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `https://job-platform-hackathon.onrender.com/api/jobs/user/${user.phone}`
        );
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("workType", formData.workType);

      if (profilePhoto) formDataToSend.append("profilePhoto", profilePhoto);
      if (removePhoto) formDataToSend.append("removePhoto", true);

      const response = await fetch(
        `https://job-platform-hackathon.onrender.com/api/users/update/${user.phone}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // DELETE Post
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`https://job-platform-hackathon.onrender.com/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          phone: user.phone   // ⭐ ONLY header allowed
        }
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert("Post deleted successfully!");
      } else {
        const errData = await response.json();
        alert(`Failed to delete post: ${errData.message}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          {user.profilePhoto && !removePhoto ? (
            <img
              src={`https://job-platform-hackathon.onrender.com${user.profilePhoto}`}
              alt="Profile"
            />
          ) : (
            <span className="profile-text">Profile</span>
          )}
        </div>

        {editing ? (
          <div className="edit-box">
            <h3>Edit Profile</h3>

            {/* Profile photo */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProfilePhoto(e.target.files[0]);
                setRemovePhoto(false);
              }}
            />
            <button
              className="remove-photo-btn"
              onClick={() => {
                setProfilePhoto(null);
                setRemovePhoto(true);
              }}
            >
              Remove Photo
            </button>

            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            {/* Work Type */}
            <select
              name="workType"
              value={isOtherSelected ? "Other" : formData.workType}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Other") {
                  setIsOtherSelected(true);
                  setFormData({ ...formData, workType: "" });
                } else {
                  setIsOtherSelected(false);
                  setFormData({ ...formData, workType: value });
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

            {isOtherSelected && (
              <input
                type="text"
                placeholder="Enter work type"
                onChange={(e) =>
                  setFormData({ ...formData, workType: e.target.value })
                }
              />
            )}

            {/* District */}
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
            >
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

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>

            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name || "Not set"}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>District:</strong> {user.district}</p>
            {user.workType && <p><strong>Work Type:</strong> {user.workType}</p>}

            <button className="profile-edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <h3>Your Posts</h3>

      <div className="posts-grid">
        {jobs.length > 0 ? (
          jobs.map((post, index) => (
            <div key={index} className="post-item">
              {post.photoUrl && (
                <img
                  src={`https://job-platform-hackathon.onrender.com${post.photoUrl}`}
                  alt="Post"
                />
              )}

              {post.voiceUrl ? (
                <audio controls>
                  <source src={`https://job-platform-hackathon.onrender.com${post.voiceUrl}`} />
                </audio>
              ) : (
                <p>No description available</p>
              )}

              <p className="place">{post.district}</p>

              {/* Only Delete button (Edit removed) */}
              <div className="post-actions">
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
