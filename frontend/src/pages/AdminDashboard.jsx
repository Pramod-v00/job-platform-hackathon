import { useEffect, useState } from "react";
import { getPendingJobs, approveJob, rejectJob } from "../services/adminservice";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);  // ⭐ NEW

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const data = await getPendingJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending jobs");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveJob(id);
      alert("Job approved");
      fetchPendingJobs();
    } catch (err) {
      console.error(err);
      alert("Error approving job");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this job?")) return;

    try {
      await rejectJob(id);
      alert("Job Rejected");
      fetchPendingJobs();
    } catch (err) {
      console.error(err);
      alert("Error rejecting job");
    }
  };

  return (
    <div className="admin-container">
      <h2>Pending Job Approvals</h2>

      {jobs.length === 0 ? (
        <p>No pending jobs.</p>
      ) : (
        <div className="admin-job-list">
          {jobs.map((job) => (
            <div className="admin-job-card" key={job._id}>
              <img
                src={job.photoUrl}
                alt="Job"
                className="admin-photo"
                onClick={() => setPreviewImage(job.photoUrl)}   // ⭐ CLICK TO OPEN POPUP
                style={{ cursor: "pointer" }}                   // ⭐ LOOK LIKE CLICKABLE
              />

              <div className="admin-info">
                <p><strong>📞 {job.postedBy}</strong></p>
                <p>📍 District: {job.district}</p>

                {job.voiceUrl && (
                  <audio controls src={job.voiceUrl}></audio>
                )}

                <div className="admin-buttons">
                  <button onClick={() => handleApprove(job._id)} className="approve-btn">
                    Approve
                  </button>
                  <button onClick={() => handleReject(job._id)} className="reject-btn">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ IMAGE POPUP MODAL */}
      {previewImage && (
        <div
          className="image-modal"
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: "80%",
              maxHeight: "90vh",
              borderRadius: "10px",
              boxShadow: "0 0 25px rgba(255,255,255,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
